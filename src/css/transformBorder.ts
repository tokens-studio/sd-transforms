import { checkAndEvaluateMath } from '../checkAndEvaluateMath.js';
import { transformDimension } from '../transformDimension.js';
import { transformHEXRGBaForCSS } from './transformHEXRGBa.js';
import { isNothing } from '../utils/is-nothing.js';

/**
 * Helper: Transforms border object to border shorthand
 * This currently works fine if every value uses an alias,
 * but if any one of these use a raw value, it will not be transformed.
 */
export function transformBorderForCSS(
  border: Record<string, string | undefined> | undefined | string,
): string | undefined {
  if (typeof border !== 'object') {
    return border;
  }
  let { color, width } = border;
  const { style } = border;
  width = transformDimension(checkAndEvaluateMath(width) as number | string | undefined);
  color = transformHEXRGBaForCSS(color);
  return `${isNothing(width) ? '' : width} ${isNothing(style) ? '' : style} ${
    isNothing(color) ? '' : color
  }`.trim();
}
