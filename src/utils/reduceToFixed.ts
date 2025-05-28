export function reduceToFixed(val: number, fractionDigits?: number): number {
  // the outer Number() gets rid of insignificant trailing zeros of decimal numbers
  return Number(Number.parseFloat(val.toString()).toFixed(fractionDigits));
}
