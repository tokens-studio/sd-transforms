/**
 * Helper: Transforms dimensions to px
 */
export function transformDimension(value: string | undefined): string | undefined {
  if (value === undefined || value.endsWith('px')) {
    return value;
  }
  return `${value}px`;
}
