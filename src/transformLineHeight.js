/**
 * Helper: Transforms line-height % to unit-less decimal value
 * @example
 * 150% -> 1.5
 * @param {string} value
 * @returns {string}
 */
export function transformLineHeight(value) {
  if (value.endsWith('%')) {
    const percentValue = value.slice(0, -1);
    return `${parseFloat(percentValue) / 100}`;
  }
  return value;
}
