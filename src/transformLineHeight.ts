import { DesignToken } from 'style-dictionary/types';
import { percentageToDecimal } from './utils/percentageToDecimal.js';

/**
 * Helper: Transforms line-height % to unit-less decimal value
 * @example
 * 150% -> 1.5
 */
export function transformLineHeight(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;
  if (val === undefined) return undefined;

  const transformLH = (lineHeight: number | string) => {
    const decimal = percentageToDecimal(lineHeight);
    return typeof decimal === 'string' || isNaN(decimal) ? `${lineHeight}` : decimal;
  };

  if (type === 'typography') {
    if (val.lineHeight !== undefined) {
      return {
        ...val,
        lineHeight: transformLH(val.lineHeight),
      };
    }
    return val;
  }
  return transformLH(val);
}
