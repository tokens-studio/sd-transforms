import { parseToRgba } from 'color2k';

/**
 * Helper: Transforms hex rgba colors used in figma tokens:
 * rgba(#ffffff, 0.5) =? rgba(255, 255, 255, 0.5).
 * This is kind of like an alpha() function.
 */
export function transformHEXRGBaForCSS(value: string | undefined): string | undefined {
  if (value === undefined) {
    return value;
  }
  const match = /rgba\((?<hex>#.+?),\s*?(?<alpha>\d.*?)\)/g.exec(value);
  if (match && match.groups) {
    const { hex, alpha } = match.groups;
    try {
      const [r, g, b] = parseToRgba(hex);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
      console.warn(`Tried parsing "${hex}" as a hex value, but failed.`);
      return value;
    }
  }
  return value;
}
