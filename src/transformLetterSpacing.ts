/**
 * Helper: Transforms letter spacing % to em
 */
export function transformLetterSpacing(value: string | undefined): string | undefined {
  if (value === undefined) {
    return value;
  }
  if (`${value}`.endsWith('%')) {
    const percentValue = value.slice(0, -1);
    return `${parseFloat(percentValue) / 100}em`;
  }
  return value;
}
