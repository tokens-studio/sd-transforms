/**
 * Helper: Transforms line-height % to unit-less decimal value
 * @example
 * 150% -> 1.5
 */
export function transformLineHeight(
  value: string | number | undefined,
): string | number | undefined {
  if (value === undefined) {
    return value;
  }
  if (`${value}`.endsWith('%')) {
    const percentValue = `${value}`.slice(0, -1);
    return parseFloat(percentValue) / 100;
  }
  return value;
}
