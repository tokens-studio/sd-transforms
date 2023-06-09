export function hasWhiteSpace(value: string | undefined | number): boolean {
  const reWhiteSpace = new RegExp('\\s+');
  if (typeof value == 'number') {
    return false;
  }

  if (value !== undefined && reWhiteSpace.test(value)) {
    return true;
  }
  return false;
}
