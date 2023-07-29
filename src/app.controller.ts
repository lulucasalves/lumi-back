import {
  Controller,
  Delete,
  Get,
  Param,
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
  getData() {
    return this.appService.getData();
  }

  @Post('/pdf')
  @UseInterceptors(FilesInterceptor('files')) // 'files' é o nome do campo do formulário para os arquivos PDF
  sendPdf(@UploadedFiles() files) {
    return this.appService.sendPdf(files);
  }

  @Delete('/pdf/:id')
  @UseInterceptors(FilesInterceptor('files')) // 'files' é o nome do campo do formulário para os arquivos PDF
  deletePdf(@Param('id') id: string) {
    return this.appService.deletePdf(id);
  }

  @Get('/uc/:id')
  getDataFromUc(@Param('id') id: string) {
    return this.appService.getDataFromUc(id);
  }
}
