import Color from 'colorjs.io';
import { ColorSpaceTypes } from '@tokens-studio/types';

export function mix(
  color: Color,
  colorSpace: ColorSpaceTypes,
  amount: number,
  mixColor: Color,
): Color {
  const mixValue = Math.max(0, Math.min(1, Number(amount)));

  return new Color(color.mix(mixColor, mixValue, { space: colorSpace }).toString());
}
