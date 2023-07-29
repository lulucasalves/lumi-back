/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { Boleto } from './models/boleto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import * as pdfjs from 'pdfjs-dist';
import { sendDataFromPdf } from './feature/getObjectsData';
import { v4 } from 'uuid';
import { setFormatedData } from './feature/setFormatedData';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
  ) {}

  async getDataFromUc(ucName: string) {
    const allData = await this.boletoRepo.find({ where: { ucName } });

    return setFormatedData(allData);
  }

  async deletePdf(id: string) {
    const s3 = new S3();
    await this.boletoRepo.delete({ id });
    await s3.deleteObject({ Bucket: 'lumilucas', Key: id }).promise();
    return 'Deleted';
  }

  async getData() {
    const allData = await this.boletoRepo.find();

    function removeRepeatedItems(array) {
      // Cria um objeto para rastrear os itens únicos
      const itensUnicos = {};

      // Filtra o array, mantendo apenas os itens que ainda não foram adicionados ao objeto itensUnicos
      const arraySemRepeticao = array.filter((item) => {
        if (!itensUnicos[item]) {
          itensUnicos[item] = true;
          return true;
        }
        return false;
      });

      return arraySemRepeticao;
    }
    return removeRepeatedItems(
      allData.map((data) => `${data.ucName} - ${data.ucNumber}`),
    );
  }

  async sendPdf(files) {
    try {
      const s3 = new S3();
      let data = [];

      for (const file of files) {
        try {
          const uint8Array = new Uint8Array(file.buffer);

          const loadingTask = pdfjs.getDocument(uint8Array);
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          const pdfData = [];

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageData = content.items.map((item) => item || '');
            pdfData.push(pageData);
          }

          const oficialData = pdfData[0].map((val) => val.str);

          data.push(sendDataFromPdf(oficialData));

          const processedData = sendDataFromPdf(oficialData);

          const verifyExist = await this.boletoRepo.findOne({
            where: {
              dataEmissao: processedData['Data de emissão'],
              ucName: processedData['Nome UC'],
              ucLocation: processedData['Endereço UC'],
            },
          });

          if (verifyExist) {
            return { message: 'Este boleto já foi cadastrado!' };
          }

          const params: AWS.S3.PutObjectRequest = {
            Bucket: 'lumilucas',
            Key: `${v4()}-${file.originalname}`, // Defina o caminho e o nome do arquivo no S3
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          const result: AWS.S3.ManagedUpload.SendData = await s3
            .upload(params)
            .promise();

          await this.boletoRepo.save({
            id: `${v4()}-${file.originalname}`,
            dataEmissao: processedData['Data de emissão'],
            dataVencimento: processedData['Data de vencimento'],
            ucLocation: processedData['Endereço UC'],
            ucName: processedData['Nome UC'],
            ucNumber: processedData['Número UC'],
            url: result.Location,
            data: JSON.stringify(processedData.data),
          });

          data.push(result.Location);
        } catch (err) {
          console.log(err);
        }
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
