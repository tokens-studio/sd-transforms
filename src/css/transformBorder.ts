import { checkAndEvaluateMath } from '../checkAndEvaluateMath.js';
import { transformDimension } from '../transformDimension.js';
import { transformHEXRGBaForCSS } from './transformHEXRGBa.js';

/**
 * Helper: Transforms border object to border shorthand
 * This currently works fine if every value uses an alias,
 * but if any one of these use a raw value, it will not be transformed.
 */
export function transformBorderForCSS(
  border: Record<string, string> | undefined | string,
): string | undefined {
  if (typeof border !== 'object') {
    return border;
  }
  const { color, width, style } = border;
  return `${transformDimension(checkAndEvaluateMath(width))} ${style} ${transformHEXRGBaForCSS(
    color,
  )}`;
}
