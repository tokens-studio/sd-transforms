import { parseToRgba } from 'color2k';
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

  const transformHEXRGBa = val => {
    const regex = /rgba\(\s*(?<hex>#.+?)\s*,\s*(?<alpha>\d*(\.\d*|%)*)\s*\)/g;
    return val.replace(regex, (match, hex, alpha) => {
      try {
        const [r, g, b] = parseToRgba(hex);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } catch (e) {
        console.warn(`Tried parsing "${hex}" as a hex value, but failed.`);
        return match;
      }
    });
  };

  const transformProp = (val, prop) => {
    if (val[prop] !== undefined) {
      val[prop] = transformHEXRGBa(val[prop]);
    }
    return val;
  };

  let transformed = val;

  switch (type) {
    case 'border':
    case 'shadow': {
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
