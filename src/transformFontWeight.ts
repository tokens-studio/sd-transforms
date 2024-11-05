import { DesignToken } from 'style-dictionary/types';

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
export const fontWeightMap = {
  hairline: 100,
  thin: 100,
  extralight: 200,
  ultralight: 200,
  extraleicht: 200,
  light: 300,
  leicht: 300,
  normal: 400,
  regular: 400,
  buch: 400,
  book: 400,
  medium: 500,
  kraeftig: 500,
  kräftig: 500,
  semibold: 600,
  demibold: 600,
  halbfett: 600,
  bold: 700,
  dreiviertelfett: 700,
  extrabold: 800,
  ultrabold: 800,
  fett: 800,
  black: 900,
  heavy: 900,
  super: 900,
  extrafett: 900,
  ultra: 950,
  ultrablack: 950,
  extrablack: 950,
};

export const fontStyles = ['italic', 'oblique', 'normal'];
export const fontWeightReg = new RegExp(
  `(?<weight>.+?)\\s?(?<style>${fontStyles.join('|')})?$`,
  'i',
);

/**
 * Helper: Transforms fontweight keynames to fontweight numbers (100, 200, 300 ... 900)
 */
export function transformFontWeight(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;
  if (val === undefined) return undefined;

  const transformWeight = (fontWeight: number | string) => {
    const match = `${fontWeight}`.match(fontWeightReg);
    if (!match?.groups) {
      return fontWeight;
    }

    let mapped;
    // lowercase to make the following code case insensitive
    const weight = match.groups.weight.toLowerCase() as keyof typeof fontWeightMap;
    const style = match.groups.style?.toLowerCase() ?? '';

    // If we only have 1 captured group, check whether it's a style or a weight.
    // "ExtraBold" and "Italic" are both valid, one is a weight and the other is a style.
    if (!style && !fontWeightMap[weight] && fontStyles.includes(weight)) {
      // if it's a style, just return as is (but lowercased now)
      return weight;
    } else {
      mapped = fontWeightMap[weight.replace(/\s/g, '') as keyof typeof fontWeightMap] ?? weight;
    }

    if (weight && style) {
      mapped = `${mapped} ${style}`;
    }

    return mapped;
  };

  if (type === 'typography') {
    if (val.fontWeight !== undefined) {
      return {
        ...val,
        fontWeight: transformWeight(val.fontWeight),
      };
    }
    return val;
  }
  return transformWeight(val);
}
