import Color from 'colorjs.io';
import { DesignToken } from 'style-dictionary/types';

/**
 * Helper: Transforms hex to rgba colors used in figma tokens:
 * rgba(#ffffff, 0.5) =? rgba(255, 255, 255, 0.5).
 * This is kind of like an alpha() function.
 */
export function transformHEXRGBaForCSS(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;
  if (val === undefined) return undefined;

  const transformHexColor = (hex: string) => {
    try {
      // Fast path for invalid hex
      if (hex.length < 4) return hex;

      // Determine format based on length
      const hexLength = hex.length - 1; // subtract 1 for #

      // Only transform hex colors with alpha channel
      const hasAlpha = hexLength === 4 || hexLength === 8;
      if (!hasAlpha) return hex;

      let hexColor = hex;
      let alpha = '1';

      // Convert shorthand to full format if necessary
      if (hexLength === 4) {
        const r = hex[1],
          g = hex[2],
          b = hex[3],
          a = hex[4];
        hexColor = `#${r}${r}${g}${g}${b}${b}`;
        alpha = (parseInt(a + a, 16) / 255).toString();
      } else if (hexLength === 8) {
        alpha = (parseInt(hex.slice(7), 16) / 255).toString();
        hexColor = hex.slice(0, 7);
      }

      const [r, g, b] = new Color(hexColor).srgb;
      return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
    } catch (e) {
      return hex;
    }
  };

  const transformHEXRGBa = (val: string) => {
    // Handle standalone hex colors
    if (val.startsWith('#')) {
      return transformHexColor(val);
    }

    // Handle rgba() with hex colors
    if (val.includes('rgba(')) {
      return val.replace(/rgba\(\s*#[A-Fa-f0-9]+\s*,\s*([0-9.%]+)\s*\)/g, (match, alpha) => {
        const hex = match.substring(match.indexOf('#'), match.indexOf(','));
        try {
          const [r, g, b] = new Color(hex).srgb;
          return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
        } catch (e) {
          console.warn(`Tried parsing "${hex}" as a hex value, but failed.`);
          return match;
        }
      });
    }

    return val;
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
