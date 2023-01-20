/**
 * Helper: Transforms dimensions to px
 * @param {string} value
 * @returns {string}
 */
export function transformDimension(value) {
  if (value.endsWith('px')) {
    return value;
  }
  return `${value}px`;
}
