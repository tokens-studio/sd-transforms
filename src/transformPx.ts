/**
 * Helper: Transforms dimensions to px
 */
export function transformPx(value: string | undefined | number): string | undefined {
  if (value === undefined) {
    return value;
  }
  if (`${value}`.endsWith('px')) {
    return `${value}`;
  }
  return `${value}px`;
}
