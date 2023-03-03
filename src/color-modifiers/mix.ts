import Color from 'colorjs.io';

export function mix(color: Color, amount: number, mixColor: Color): Color {
  const mixValue = Math.max(0, Math.min(1, Number(amount)));

  return new Color(color.mix(mixColor, mixValue).toString());
}
