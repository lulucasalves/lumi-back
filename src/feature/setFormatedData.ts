export function setFormatedData(dataList) {
  const xs = {
    '01': 'Jan',
    '02': 'Fev',
    '03': 'Mar',
    '04': 'Abr',
    '05': 'Mai',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Ago',
    '09': 'Set',
    '10': 'Out',
    '11': 'Nov',
    '12': 'Dez',
  };

  const result = {
    Total: {
      Quantidade: [],
      Valor: [],
      'Tarifa Unitária': [],
      'Preço Unitário': [],
    },
    'Energia Elétrica': {
      Quantidade: [],
      Valor: [],
      'Tarifa Unitária': [],
      'Preço Unitário': [],
    },
    'Energia Injetada': {
      Quantidade: [],
      Valor: [],
      'Tarifa Unitária': [],
      'Preço Unitário': [],
    },
    ICMS: {
      Quantidade: [],
      'Tarifa Unitária': [],
      'Preço Unitário': [],
    },
    'ICMS-ST': {
      Valor: [],
    },
    Contribuição: {
      Valor: [],
    },
    'Via de débito': {
      Valor: [],
    },
  };

  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const quantidade = dataJson.Total.Quantidade;
    const valor = dataJson.Total.Valor;
    const tarifa = dataJson.Total['Tarifa Unitária'];
    const preco = dataJson.Total['Preço Unitário'];

    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result.Total.Quantidade.push({ x: xName, y: quantidade });
    result.Total.Valor.push({ x: xName, y: valor });
    result.Total['Tarifa Unitária'].push({
      x: xName,
      y: tarifa,
    });
    result.Total['Preço Unitário'].push({
      x: xName,
      y: preco,
    });
  }

  function complemention(resultKey: string) {
    for (const key of Object.keys(result[resultKey])) {
      const xsObjects = Object.keys(xs).map((val) => parseInt(val) - 1);
      const resultKeys = result[resultKey][key].map((val) => val.x);

      const missingMonths = xsObjects.filter(
        (item) => !resultKeys.includes(item),
      );

      console.log(missingMonths);

      for (const x of missingMonths) {
        result[resultKey][key].push({ x: x, y: 0 });
      }

      result[resultKey][key].sort(
        (a, b) => Object.keys(xs).indexOf(a.x) - Object.keys(xs).indexOf(b.x),
      );
    }
  }

  complemention('Total');

  //-------------------------------------

  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const quantidade = dataJson['Energia Elétrica'].Quantidade;
    const valor = dataJson['Energia Elétrica'].Valor;
    const tarifa = dataJson['Energia Elétrica']['Tarifa Unitária'];
    const preco = dataJson['Energia Elétrica']['Preço Unitário'];

    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result['Energia Elétrica'].Quantidade.push({ x: xName, y: quantidade });
    result['Energia Elétrica'].Valor.push({ x: xName, y: valor });
    result['Energia Elétrica']['Tarifa Unitária'].push({
      x: xName,
      y: tarifa,
    });
    result['Energia Elétrica']['Preço Unitário'].push({
      x: xName,
      y: preco,
    });
  }

  complemention('Energia Elétrica');

  //-------------------------------------

  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const quantidade = dataJson['Energia Injetada'].Quantidade;
    const valor = dataJson['Energia Injetada'].Valor;
    const tarifa = dataJson['Energia Injetada']['Tarifa Unitária'];
    const preco = dataJson['Energia Injetada']['Preço Unitário'];

    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result['Energia Injetada'].Quantidade.push({ x: xName, y: quantidade });
    result['Energia Injetada'].Valor.push({ x: xName, y: valor });
    result['Energia Injetada']['Tarifa Unitária'].push({
      x: xName,
      y: tarifa,
    });
    result['Energia Injetada']['Preço Unitário'].push({
      x: xName,
      y: preco,
    });
  }

  complemention('Energia Injetada');

  //-------------------------------------------------------------
  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const quantidade = dataJson.ICMS.Quantidade;
    const tarifa = dataJson.ICMS['Tarifa Unitária'];
    const preco = dataJson.ICMS['Preço Unitário'];

    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result.ICMS.Quantidade.push({ x: xName, y: quantidade });
    result.ICMS['Tarifa Unitária'].push({
      x: xName,
      y: tarifa,
    });
    result.ICMS['Preço Unitário'].push({
      x: xName,
      y: preco,
    });
  }

  complemention('ICMS');

  //--------------------------------------------
  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const valor = dataJson['ICMS-ST'].Valor;
    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result['ICMS-ST'].Valor.push({ x: xName, y: valor });
  }

  complemention('ICMS-ST');

  //-----------------------------------

  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const valor = dataJson.Contribuição.Valor;

    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result.Contribuição.Valor.push({ x: xName, y: valor });
  }

  complemention('Contribuição');

  //-------------------------------------------------------------

  for (const item of dataList) {
    const dataJson = JSON.parse(item.data);
    const valor = dataJson['Via de débito'];

    const [day, x, year] = item.dataEmissao.split('/');
    const xName = parseInt(x) - 1;

    result['Via de débito'].Valor.push({ x: xName, y: valor });
  }

  complemention('Via de débito');

  function sortListsByX(listOfLists) {
    let newArray = {};
    const listOfObjects = Object.keys(listOfLists);
    for (const i of listOfObjects) {
      let arrayKeys = {};
      const keys = Object.keys(listOfLists[i]);

      for (const key of keys) {
        const listGet = listOfLists[i][key].sort((a, b) => a.x - b.x);
        arrayKeys = { ...arrayKeys, [key]: listGet };
      }

      newArray = { ...newArray, [i]: arrayKeys };
    }

    return newArray;
  }

  return sortListsByX(result);
}
