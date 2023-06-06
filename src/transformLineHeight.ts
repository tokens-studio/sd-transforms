import { percentageToDecimal } from './utils/percentageToDecimal.js';

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
  const decimal = percentageToDecimal(value);
  return typeof decimal === 'string' || isNaN(decimal) ? `${value}` : decimal;
}
