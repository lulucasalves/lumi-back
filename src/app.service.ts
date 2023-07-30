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

export interface IDataObject {
  Total: {
    Quantidade: { x: number; y: number }[];
    Valor: { x: number; y: number }[];
    'Tarifa Unitária': { x: number; y: number }[];
    'Preço Unitário': { x: number; y: number }[];
  };
  'Energia Elétrica': {
    Quantidade: { x: number; y: number }[];
    Valor: { x: number; y: number }[];
    'Tarifa Unitária': { x: number; y: number }[];
    'Preço Unitário': { x: number; y: number }[];
  };
  'Energia Injetada': {
    Quantidade: { x: number; y: number }[];
    Valor: { x: number; y: number }[];
    'Tarifa Unitária': { x: number; y: number }[];
    'Preço Unitário': { x: number; y: number }[];
  };
  ICMS: {
    Quantidade: { x: number; y: number }[];
    'Tarifa Unitária': { x: number; y: number }[];
    'Preço Unitário': { x: number; y: number }[];
  };
  'ICMS-ST': {
    Valor: { x: number; y: number }[];
  };
  Contribuição: {
    Valor: { x: number; y: number }[];
  };
  'Via de débito': {
    Valor: { x: number; y: number | string }[];
  };
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
  ) {}

  async getDataFromUc(
    ucNumber: string,
  ): Promise<IDataObject | { message: string }> {
    try {
      const allData = await this.boletoRepo.find({
        where: { ucNumber },
      });

      return setFormatedData(allData) as IDataObject;
    } catch (err) {
      console.log(err);
      return { message: 'Ocorreu um erro ao adquirir os dados!' };
    }
  }

  async getList(ucNumber: string) {
    try {
      const allData = await this.boletoRepo.find({ where: { ucNumber } });

      return allData.map((val) => {
        return {
          ucNome: val.ucName,
          ucNumero: val.ucNumber,
          dataEmissao: val.dataEmissao,
          dataVencimento: val.dataVencimento,
          energiaEletrica: JSON.parse(val.data)['Energia Elétrica'].Valor,
          icmsSt: JSON.parse(val.data)['ICMS-ST'].Valor,
          viaDebito: JSON.parse(val.data)['Via de débito'],
          total: JSON.parse(val.data)['Total'].Valor,
          payed: val.payed,
          url: val.url,
          id: val.id,
        };
      });
    } catch (err) {
      console.log(err);
      return { message: 'Ocorreu um erro ao adquirir os dados!' };
    }
  }

  async deletePdf(id: string) {
    try {
      const s3 = new S3();

      const ucNumber = await this.boletoRepo.findOne({ where: { id } });

      const uc = await this.boletoRepo.find({
        where: { ucNumber: ucNumber.ucNumber },
      });

      if (uc.length < 2) {
        return {
          message: 'É necessário possuir pelo menos 1 boleto no sistema!',
        };
      }
      await this.boletoRepo.delete({ id });
      await s3.deleteObject({ Bucket: 'lumilucas', Key: id }).promise();
      return this.getList(ucNumber.ucNumber);
    } catch (err) {
      console.log(err);
      return { message: 'Ocorreu um erro ao deletar este boleto!' };
    }
  }

  async putPdf({ id, payed }: { id: string; payed: boolean }) {
    try {
      await this.boletoRepo.update({ id }, { payed });
      const ucNumber = await this.boletoRepo.findOne({ where: { id } });

      return this.getList(ucNumber.ucNumber);
    } catch (err) {
      console.log(err);
      return { message: 'Ocorreu um erro ao alterar este boleto!' };
    }
  }

  async getData() {
    try {
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
    } catch (err) {
      console.log(err);
      return { message: 'Ocorreu um erro ao adquirir os dados!' };
    }
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

          if (!processedData.data.Total.Quantidade) {
            return { message: 'Ocorreu um erro ao enviar o boleto!' };
          }

          const [day, month, year] =
            processedData['Data de emissão'].split('/');

          if (year !== '2023') {
            return {
              message: 'Nesta versão só é permitido boletos emitidos em 2023!',
            };
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

          data.push(processedData['Número UC']);
        } catch (err) {
          console.log(err);
        }
      }

      return this.getList(data[0]['Número UC']);
    } catch (err) {
      console.log(err);
      return { message: 'Ocorreu um erro ao enviar o boleto!' };
    }
  }
}
