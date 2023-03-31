import { percentageToDecimal } from './utils/percentageToDecimal.js';

/**
 * Helper: Transforms letter spacing % to em
 */
export function transformLetterSpacingForCSS(
  value: string | number | undefined,
): string | undefined {
  if (value === undefined) {
    return value;
  }
  const decimal = percentageToDecimal(value);
  return typeof decimal === 'string' || isNaN(decimal) ? `${value}` : `${decimal}em`;
}
