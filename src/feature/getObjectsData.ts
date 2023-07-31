import { transformNumber } from '.';

export function sendDataFromPdf(data: string[]) {
  let comprovantePagamento = 0;
  let outrasAtividades = 0;

  for (let i = 0; i < data.length; i++) {
    if (
      data[i].includes('Comprovante de Pagamento') ||
      data[i].includes('NnNn')
    ) {
      comprovantePagamento = i;
    }

    if (data[i] === 'e outras atividades') {
      outrasAtividades = i;
    }
  }

  const energiaEletricaQuantidade = data[31];
  const energiaEletricaPrecoUnitario = data[33];
  const energiaEletricaValor = data[35];
  const energiaEletricaTarifaUnitaria = data[37];
  const energiaInjetadaQuantidade = data[42];
  const energiaInjetadaPrecoUnitario = data[44];
  const energiaInjetadaValor = data[46];
  const energiaInjetadaTarifaUnitaria = data[48];
  const icmsQuantidade = data[53];
  const icmsPrecoUnitario = data[55];
  const icmsValor = data[57];
  const icmsTarifaUnitaria = data[59];
  const contribuicaoPublicaValor = data[62];
  const viadebito = data[65].includes(',') ? data[65] : '-';
  const nomeUc = data[comprovantePagamento + 2];
  const enderecoUc = `${data[comprovantePagamento + 4]} - ${
    data[comprovantePagamento + 5]
  } - ${data[comprovantePagamento + 6]}`;
  const numeroUc = data[comprovantePagamento + 13];
  const [, anoEmissao] = data[comprovantePagamento + 23].split('/');
  const dataEmissao = `${data[outrasAtividades + 4]}/${anoEmissao}`;
  const dataVencimento = data[comprovantePagamento + 25];
  const debitoValor = viadebito !== '-' ? transformNumber(viadebito) : 0;
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
          debitoValor +
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
      'Via de débito': viadebito,
    },
  };
}
