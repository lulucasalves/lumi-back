import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Boleto } from './models/boleto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleto]),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
