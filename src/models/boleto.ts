import { Column, Entity } from 'typeorm';

@Entity()
export class Boleto {
  @Column({ primary: true, unique: true, nullable: false })
  id: string;

  @Column()
  ucName: string;

  @Column()
  ucNumber: string;

  @Column()
  ucLocation: string;

  @Column()
  dataEmissao: string;

  @Column()
  dataVencimento: string;

  @Column({ default: false })
  payed: boolean;

  @Column()
  url: string;

  @Column({
    default: `{
    "Total": {
      "Quantidade": 0,
      "Preço Unitário": 0,
      "Tarifa Unitária": 0,
      "Valor": 0
    },
    "Energia Elétrica": {
      "Quantidade": 0,
      "Preço Unitário": 0,
      "Tarifa Unitária": 0,
      "Valor": 0
    },
    "Energia Injetada": {
      "Quantidade": 0,
      "Preço Unitário": 0,
      "Tarifa Unitária": 0,
      "Valor": 0
    },
    "ICMS": {
      "Quantidade": 0,
      "Preço Unitário": 0,
      "Tarifa Unitária": 0
    },
    "ICMS-ST": { "Valor": 0 },
    "Contribuição": { "Valor": 0 }
  }
  `,
  })
  data: string;
}
