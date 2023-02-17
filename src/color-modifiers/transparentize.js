/**
 * @typedef {import('colorjs.io').default} Color
 */

/**
 *
 * @param {Color} color
 * @param {number} amount
 * @returns {Color}
 */
export function transparentize(color, amount) {
  const _color = color;
  _color.alpha = Math.max(0, Math.min(1, Number(amount)));
  return _color;
}
