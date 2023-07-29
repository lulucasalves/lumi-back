import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Boleto } from './models/boleto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleto]),
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
