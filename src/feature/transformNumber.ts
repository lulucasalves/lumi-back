export function transformNumber(data: string) {
  return parseFloat(data.replace('.', '').replace(',', '.'));
}
