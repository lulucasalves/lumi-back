import { Column, Entity } from 'typeorm';

@Entity()
export class Boleto {
  @Column({ primary: true, unique: true, nullable: false })
  id: string;

  @Column()
  ucName: string;

  @Column()
  ucNumber: number;

  @Column()
  ucLocation: string;

  @Column()
  dataEmissao: string;

  @Column()
  dataVencimento: string;

  @Column()
  icms: string;

  @Column({ default: false })
  payed: boolean;

  @Column()
  url: string;

  @Column()
  data: string;
}
