/**
 * Helper: Transforms boxShadow object to shadow shorthand
 * This currently works fine if every value uses an alias,
 * but if any one of these use a raw value, it will not be transformed.
 */
export function transformShadow(shadow: Record<string, string> | undefined): string | undefined {
  if (shadow === undefined) {
    return shadow;
  }
  const { x, y, blur, spread, color, type } = shadow;
  return `${type === 'innerShadow' ? 'inset ' : ''}${x} ${y} ${blur} ${spread} ${color}`;
}
