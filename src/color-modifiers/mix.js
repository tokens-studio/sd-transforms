import Color from 'colorjs.io';

/**
 *
 * @param {Color} color
 * @param {number} amount
 * @param {Color} mixColor
 * @returns {Color}
 */
export function mix(color, amount, mixColor) {
  const mixValue = Math.max(0, Math.min(1, Number(amount)));

  return new Color(color.mix(mixColor, mixValue).toString());
}
