import Color from 'colorjs.io';

export function transparentize(color: Color, amount: number): Color {
  const _color = color;
  _color.alpha = Math.max(0, Math.min(1, Number(amount)));
  return _color;
}
