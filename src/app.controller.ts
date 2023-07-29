import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello() {
    return this.appService.getHello();
  }

  @Post('/pdf')
  @UseInterceptors(FilesInterceptor('files')) // 'files' é o nome do campo do formulário para os arquivos PDF
  sendPdf(@UploadedFiles() files) {
    return this.appService.sendPdf(files);
  }
}
