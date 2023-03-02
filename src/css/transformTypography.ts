/**
 * Helper: Transforms typography object to typography shorthand for CSS
 * This currently works fine if every value uses an alias, but if any one of these use a raw value, it will not be transformed.
 * If you'd like to output all typography values, you'd rather need to return the typography properties itself
 */
export function transformTypographyForCSS(value: Record<string, string>): string {
  const { fontWeight, fontSize, lineHeight, fontFamily } = value;
  return `${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
}
