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
    const data = await appService.getDataFromUc('7202788969', '2023');

    expect(data).toHaveProperty('Total');
    expect(data).toHaveProperty('Energia Elétrica');
    expect(data).toHaveProperty('Energia Injetada');
    expect(data).toHaveProperty('ICMS');
    expect(data).toHaveProperty('ICMS-ST');
    expect(data).toHaveProperty('Contribuição');
    expect(data).toHaveProperty('Via de débito');
  });

  it('should return list of data', async () => {
    const data = await appService.getList('3434', '2023');

    expect(data).toStrictEqual([]);
  });
});
