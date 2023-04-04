import { transformDimension } from '../transformDimension.js';
import { transformHEXRGBaForCSS } from './transformHEXRGBa.js';

/**
 * Helper: Transforms boxShadow object to shadow shorthand
 * This currently works fine if every value uses an alias,
 * but if any one of these use a raw value, it will not be transformed.
 */
export function transformShadowForCSS(
  shadow: Record<string, string> | undefined | string,
): string | undefined {
  if (typeof shadow !== 'object') {
    return shadow;
  }
  let { x, y, blur, spread } = shadow;
  const { color, type } = shadow;
  x = transformDimension(x) as string;
  y = transformDimension(y) as string;
  blur = transformDimension(blur) as string;
  spread = transformDimension(spread) as string;
  return `${
    type === 'innerShadow' ? 'inset ' : ''
  }${x} ${y} ${blur} ${spread} ${transformHEXRGBaForCSS(color)}`;
}
