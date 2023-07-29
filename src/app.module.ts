import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Boleto } from './models/boleto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleto]),
    TypeOrmModule.forRoot(typeOrmConfig),
    RateLimiterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class AppModule {}
