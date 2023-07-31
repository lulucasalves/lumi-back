import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @Put('/pdf')
  @UseInterceptors(FilesInterceptor('files')) // 'files' é o nome do campo do formulário para os arquivos PDF
  changePdf(@Body() value) {
    return this.appService.putPdf(value);
  }

  @Delete('/pdf/:id')
  @UseInterceptors(FilesInterceptor('files')) // 'files' é o nome do campo do formulário para os arquivos PDF
  deletePdf(@Param('id') id: string) {
    return this.appService.deletePdf(id);
  }

  @Get('/uc/:id/:year')
  getDataFromUc(@Param('year') year: string, @Param('id') id: string) {
    return this.appService.getDataFromUc(id, year);
  }

  @Get('/list/:id/:year')
  getList(@Param('year') year: string, @Param('id') id: string) {
    return this.appService.getList(id, year);
  }
}
