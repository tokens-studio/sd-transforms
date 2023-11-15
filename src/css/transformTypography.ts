import { transformDimension } from '../transformDimension.js';
import { transformFontWeights } from '../transformFontWeights.js';
import { checkAndEvaluateMath } from '../checkAndEvaluateMath.js';
import { isNothing } from '../utils/is-nothing.js';

export function hasWhiteSpace(value: string): boolean {
  const whiteSpaceRegex = new RegExp('\\s+');
  return whiteSpaceRegex.test(value);
}

export function isAlreadyQuoted(value: string): boolean {
  return value.startsWith("'") && value.endsWith("'");
}

export function isCommaSeparated(value: string): boolean {
  return value.includes(',');
}

export function escapeApostrophes(str: string) {
  return str.replace(/'/g, "\\'");
}

function quoteWrapWhitespacedFont(fontString: string) {
  let escapedFontString = escapeApostrophes(fontString);
  return hasWhiteSpace(escapedFontString) && !isAlreadyQuoted(escapedFontString) ? `'${escapedFontString}'` : escapedFontString;
}

export function processFontFamily(fontFamily: string | undefined) {
  if (isNothing(fontFamily)) {
    return 'sans-serif';
  }

  if (isCommaSeparated(fontFamily as string)) {
    let fontFamilyArray = [];
    fontFamilyArray = (fontFamily as string).split(',').map(part => part.trim());
    return fontFamilyArray.map((part: string) => quoteWrapWhitespacedFont(part)).join(', ');
  }

  return quoteWrapWhitespacedFont(fontFamily as string);
}

/**
 * Helper: Transforms typography object to typography shorthand for CSS
 * This currently works fine if every value uses an alias, but if any one of these use a raw value, it will not be transformed.
 * If you'd like to output all typography values, you'd rather need to return the typography properties itself
 */

export function transformTypographyForCSS(
  value: Record<string, string | undefined | number> | undefined | string,
): string | undefined {
  if (typeof value !== 'object') {
    return value;
  }

  let { fontFamily, fontWeight, fontSize, lineHeight } = value;
  const { fontStyle } = value;
  fontSize = transformDimension(checkAndEvaluateMath(fontSize) as number | string | undefined);
  lineHeight = checkAndEvaluateMath(lineHeight) as number | string | undefined;
  fontWeight = transformFontWeights(fontWeight);
  fontFamily = processFontFamily(fontFamily as string | undefined);

  return `${isNothing(fontWeight) ? 400 : fontWeight}${
    isNothing(fontStyle) ? '' : ` ${fontStyle}`
  } ${isNothing(fontSize) ? '16px' : fontSize}/${
    isNothing(lineHeight) ? 1 : lineHeight
  } ${fontFamily}`;
}
