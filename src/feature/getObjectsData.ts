import { transformNumber } from '.';
import { validatedDates } from './validatedDates';

export function sendDataFromPdf(dataBrute: string) {
  let nomeUc = '';
  let numeroUc = '';
  let enderecoUc = '';
  let dataEmissao = '';
  let dataVencimento = '';
  let energiaEletricaQuantidade = '';
  let energiaInjetadaQuantidade = '';
  let icmsQuantidade = '';
  let energiaEletricaPrecoUnitario = '';
  let energiaInjetadaPrecoUnitario = '';
  let icmsPrecoUnitario = '';
  let debitoValor = '0';
  let icmsValor = '';
  let energiaInjetadaValor = '';
  let energiaEletricaValor = '';
  let contribuicaoPublicaValor = '';
  let energiaEletricaTarifaUnitaria = '';
  let energiaInjetadaTarifaUnitaria = '';
  let icmsTarifaUnitaria = '';

  const data = dataBrute.split('\n');

  for (let i = 0; i < data.length; i++) {
    const text = data[i].toLowerCase();
    const textNoSpace = text.replaceAll(' ', '');
    let textNumbers = 0;

    if (text.includes('data de emissão: ')) {
      const [, dateSplited] = textNoSpace.split(':');

      dataEmissao = dateSplited;
    }

    if (textNoSpace.includes('/')) {
      const [month] = textNoSpace.split('/');

      if (validatedDates.includes(month)) {
        const textValidated = data[i].split(' ');
        dataVencimento = textValidated.join('').slice(8, 18);
      }
    }
    for (const t of textNoSpace) {
      if (!isNaN(parseInt(t))) {
        textNumbers += 1;
      } else {
        textNumbers = 0;
      }
    }
    if (text.includes('rua ')) {
      enderecoUc = data[i];
      nomeUc = data[i - 1];
    }

    if (textNumbers === 20) {
      numeroUc = data[i].slice(2, 12);
    }

    if (data[i].includes('Energia Elétricak')) {
      const listTable = data[i].split(' ').filter((val) => val !== '');
      energiaEletricaQuantidade = listTable[2];
      energiaEletricaPrecoUnitario = listTable[3];
      energiaEletricaValor = listTable[4];
      energiaEletricaTarifaUnitaria = listTable[5];
    }

    if (data[i].includes('Energia injetada')) {
      const listTable = data[i].split(' ').filter((val) => val !== '');
      energiaInjetadaQuantidade = listTable[3];
      energiaInjetadaPrecoUnitario = listTable[4];
      energiaInjetadaValor = listTable[5];
      energiaInjetadaTarifaUnitaria = listTable[6];
    }

    if (data[i].includes('Energia compensada')) {
      const listTable = data[i].split(' ').filter((val) => val !== '');
      energiaInjetadaQuantidade = listTable[4];
      energiaInjetadaPrecoUnitario = listTable[5];
      energiaInjetadaValor = listTable[6];
      energiaInjetadaTarifaUnitaria = listTable[7];
    }

    if (data[i].includes('ICMSkWh')) {
      const listTable = data[i].split(' ').filter((val) => val !== '');
      icmsQuantidade = listTable[4];
      icmsPrecoUnitario = listTable[5];
      icmsValor = listTable[6];
      icmsTarifaUnitaria = listTable[7];
    }

    if (text.includes('via de débito')) {
      const [, debito] = textNoSpace.split('débito');
      debitoValor = debito;
    }

    if (text.includes('publica municipal')) {
      const [, contribuicao] = text.split('municipal');
      contribuicaoPublicaValor = contribuicao;
    }
  }

  const icmsSt =
    transformNumber(icmsValor) + transformNumber(energiaInjetadaValor);

  return {
    'Nome UC': nomeUc,
    'Número UC': numeroUc,
    'Endereço UC': enderecoUc,
    'Data de emissão': dataEmissao,
    'Data de vencimento': dataVencimento,
    data: {
      Total: {
        Quantidade:
          transformNumber(energiaEletricaQuantidade) +
          transformNumber(energiaInjetadaQuantidade) +
          transformNumber(icmsQuantidade),
        'Preço Unitário':
          transformNumber(energiaEletricaPrecoUnitario) +
          transformNumber(energiaInjetadaPrecoUnitario) +
          transformNumber(icmsPrecoUnitario),
        Valor:
          0.001 +
          transformNumber(debitoValor) +
          icmsSt +
          transformNumber(energiaEletricaValor) +
          transformNumber(contribuicaoPublicaValor),
        'Tarifa Unitária':
          transformNumber(energiaEletricaTarifaUnitaria) +
          transformNumber(energiaInjetadaTarifaUnitaria) +
          transformNumber(icmsTarifaUnitaria),
      },
      'Energia Elétrica': {
        Quantidade: transformNumber(energiaEletricaQuantidade),
        'Preço Unitário': transformNumber(energiaEletricaPrecoUnitario),
        Valor: transformNumber(energiaEletricaValor),
        'Tarifa Unitária': transformNumber(energiaEletricaTarifaUnitaria),
      },
      'Energia Injetada': {
        Quantidade: transformNumber(energiaInjetadaQuantidade),
        'Preço Unitário': transformNumber(energiaInjetadaPrecoUnitario),
        Valor: transformNumber(energiaInjetadaValor),
        'Tarifa Unitária': transformNumber(energiaInjetadaTarifaUnitaria),
      },
      ICMS: {
        Quantidade: transformNumber(icmsQuantidade),
        'Preço Unitário': transformNumber(icmsPrecoUnitario),
        'Tarifa Unitária': transformNumber(icmsTarifaUnitaria),
      },
      'ICMS-ST': {
        Valor: icmsSt,
      },
      Contribuição: {
        Valor: transformNumber(contribuicaoPublicaValor),
      },
      'Via de débito': transformNumber(debitoValor),
    },
  };
}
