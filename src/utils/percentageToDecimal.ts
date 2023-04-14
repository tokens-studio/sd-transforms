export function percentageToDecimal(value: string | number): string | number {
  if (!`${value}`.endsWith('%')) {
    return `${value}`;
  }
  const percentValue = `${value}`.slice(0, -1);
  const numberValue = parseFloat(percentValue);
  return numberValue / 100;
}
