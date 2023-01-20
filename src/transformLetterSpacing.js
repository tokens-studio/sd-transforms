/**
 * Helper: Transforms letter spacing % to em
 * @param {string} value
 * @returns {string}
 */
export function transformLetterSpacing(value) {
  if (value.endsWith('%')) {
    const percentValue = value.slice(0, -1);
    return `${parseFloat(percentValue) / 100}em`;
  }
  return value;
}
