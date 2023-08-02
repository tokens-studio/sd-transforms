import { checkAndEvaluateMath } from '../checkAndEvaluateMath.js';
import { transformDimension } from '../transformDimension.js';
import { transformHEXRGBaForCSS } from './transformHEXRGBa.js';
import { isNothing } from '../utils/is-nothing.js';

/**
 * Helper: Transforms boxShadow object to shadow shorthand
 * This currently works fine if every value uses an alias,
 * but if any one of these use a raw value, it will not be transformed.
 */
export function transformShadowForCSS(
  shadow: Record<string, string | undefined> | undefined | string,
): string | undefined {
  if (typeof shadow !== 'object') {
    return shadow;
  }
  let { x, y, blur, spread } = shadow;
  const { color, type } = shadow;
  x = transformDimension(checkAndEvaluateMath(x) as number | string | undefined);
  y = transformDimension(checkAndEvaluateMath(y) as number | string | undefined);
  blur = transformDimension(checkAndEvaluateMath(blur) as number | string | undefined);
  spread = transformDimension(checkAndEvaluateMath(spread) as number | string | undefined);
  return `${type === 'innerShadow' ? 'inset ' : ''}${isNothing(x) ? 0 : x} ${
    isNothing(y) ? 0 : y
  } ${isNothing(blur) ? 0 : blur}${isNothing(spread) ? ' ' : ` ${spread} `}${
    transformHEXRGBaForCSS(color) ?? 'rgba(0, 0, 0, 1)'
  }`.trim();
}
