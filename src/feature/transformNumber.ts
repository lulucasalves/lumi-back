export function transformNumber(data: string) {
  const newNumber = parseFloat(data.replace('.', '').replace(',', '.'));
  return newNumber;
}
