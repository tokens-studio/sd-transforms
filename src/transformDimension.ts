/**
 * Helper: Transforms dimensions to px
 */
export function transformDimension(value: string): string {
  if (value.endsWith('px')) {
    return value;
  }
  return `${value}px`;
}
