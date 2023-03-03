import Color from 'colorjs.io';
import { transparentize } from './transparentize';
import { mix } from './mix';
import { darken } from './darken';
import { lighten } from './lighten';
import { ColorModifier } from './types/Modifier';

export function modifyColor(
  baseColor: string | undefined,
  modifier: ColorModifier,
): string | undefined {
  if (baseColor === undefined) {
    return baseColor;
  }
  const color = new Color(baseColor);
  let returnedColor = color;
  try {
    switch (modifier.type) {
      case 'lighten':
        returnedColor = lighten(color, modifier.space, Number(modifier.value));
        break;
      case 'darken':
        returnedColor = darken(color, modifier.space, Number(modifier.value));
        break;
      case 'mix':
        returnedColor = mix(color, Number(modifier.value), new Color(modifier.color));
        break;
      case 'alpha': {
        returnedColor = transparentize(color, Number(modifier.value));
        break;
      }
      default:
        returnedColor = color;
        break;
    }

    returnedColor = returnedColor.to(modifier.space);
    if (modifier.format && ['lch', 'srgb', 'p3', 'hsl'].includes(modifier.format)) {
      returnedColor = returnedColor.to(modifier.format);
    }

    return returnedColor.toString({
      inGamut: true,
      precision: 3,
      format: modifier.format,
    });
  } catch (e) {
    return baseColor;
  }
}
