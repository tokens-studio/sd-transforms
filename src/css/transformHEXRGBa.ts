import Color from 'colorjs.io';
import { DesignToken } from 'style-dictionary/types';

/**
 * Helper: Transforms hex rgba colors used in figma tokens:
 * rgba(#ffffff, 0.5) =? rgba(255, 255, 255, 0.5).
 * This is kind of like an alpha() function.
 */
export function transformHEXRGBaForCSS(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;
  if (val === undefined) return undefined;

  const transformHEXRGBa = (val: string) => {
    const regex = /rgba\(\s*(?<hex>#.+?)\s*,\s*(?<alpha>\d*(\.\d*|%)*)\s*\)/g;
    return val.replace(regex, (match, hex, alpha) => {
      try {
        const [r, g, b] = new Color(hex).srgb;
        return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
      } catch (e) {
        console.warn(`Tried parsing "${hex}" as a hex value, but failed.`);
        return match;
      }
    });
  };

  const transformProp = (val: Record<string, unknown>, prop: string) => {
    if (val[prop] !== undefined && typeof val[prop] === 'string') {
      val[prop] = transformHEXRGBa(val[prop]);
    }
    return val;
  };

  let transformed = val;

  switch (type) {
    case 'border':
    case 'shadow': {
      transformed = transformed as
        | Record<string, number | string>
        | Record<string, number | string>[];
      if (Array.isArray(transformed)) {
        transformed = transformed.map(item => transformProp(item, 'color'));
      } else {
        transformed = transformProp(transformed, 'color');
      }
      break;
    }
    default:
      transformed = transformHEXRGBa(val);
  }

  return transformed;
}
