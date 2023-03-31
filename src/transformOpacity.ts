import { percentageToDecimal } from './utils/percentageToDecimal.js';

/**
 * Helper: Transforms opacity % to a decimal point number
 * @example
 * 50% -> 0.5
 */
export function transformOpacity(value: string | number | undefined): string | number | undefined {
  if (value === undefined) {
    return value;
  }
  const decimal = percentageToDecimal(value);
  return typeof decimal === 'string' || isNaN(decimal) ? `${value}` : `${decimal}`;
}
