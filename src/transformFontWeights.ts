export const fontWeightMap = {
  hairline: 1,
  thin: 100,
  extralight: 200,
  ultralight: 200,
  extraleicht: 200,
  light: 300,
  leicht: 300,
  normal: 400,
  regular: 400,
  buch: 400,
  medium: 500,
  kraeftig: 500,
  kräftig: 500,
  semibold: 600,
  demibold: 600,
  halbfett: 600,
  bold: 700,
  dreiviertelfett: 700,
  extrabold: 800,
  ultabold: 800,
  fett: 800,
  black: 900,
  heavy: 900,
  super: 900,
  extrafett: 900,
  ultra: 1000,
};

export const fontStyles = ['italic', 'oblique', 'normal'];
export const fontWeightReg = new RegExp(
  `(?<weight>.+?)\\s?(?<style>${fontStyles.join('|')})?$`,
  'i',
);

/**
 * Helper: Transforms fontweight keynames to fontweight numbers (100, 200, 300 ... 900)
 */
export function transformFontWeights(
  value: string | undefined | number,
): number | string | undefined {
  if (value === undefined) {
    return value;
  }
  const match = `${value}`.match(fontWeightReg);

  let mapped;
  if (match?.groups?.weight) {
    mapped = fontWeightMap[match?.groups?.weight.toLowerCase()];
    if (match.groups.style) {
      mapped = `${mapped} ${match.groups.style.toLowerCase()}`;
    }
  }

  return mapped ?? value;
}
