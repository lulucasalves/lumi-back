import { Test } from '@nestjs/testing';
import { AppService } from '../app.service';
import { RootModule } from './root-test.module'; // Importe o módulo de teste aqui

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RootModule], // Importe o módulo de teste aqui
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
  });

  it('should return a object for graphics', async () => {
    const data = await appService.getData();

    expect(data[0]).toBe('BRONYER TOZATTI FERREIRA - 7202788969');
  });
});
