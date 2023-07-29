/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { Boleto } from './models/boleto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
  ) {}

  async getHello() {
    const allData = await this.boletoRepo.find();
    return allData;
  }

  async sendPdf(files) {
    try {
      const s3 = new S3();
      let data = [];
      for (const file of files) {
        const params: AWS.S3.PutObjectRequest = {
          Bucket: 'lumilucas',
          Key: `${file.originalname}`, // Defina o caminho e o nome do arquivo no S3
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const result: AWS.S3.ManagedUpload.SendData = await s3
          .upload(params)
          .promise();

        data.push(result.Location);
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
