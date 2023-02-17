import Color from 'colorjs.io';
import { transparentize } from './transparentize.js';
import { mix } from './mix.js';
import { darken } from './darken.js';
import { lighten } from './lighten.js';

/**
 * @typedef {import('./types/Modifier').ColorModifier} ColorModifier
 * @typedef {import('./types/Modifier').MixModifier} MixModifier
 */

/**
 *
 * @param {string} baseColor
 * @param {ColorModifier} modifier
 * @returns
 */
export function modifyColor(baseColor, modifier) {
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
        returnedColor = mix(
          color,
          Number(modifier.value),
          new Color(/** @type {MixModifier} */ (modifier).color),
        );
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
    return returnedColor.toString({ inGamut: true, precision: 3 });
  } catch (e) {
    return baseColor;
  }
}
