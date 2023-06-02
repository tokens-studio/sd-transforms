export function hasWhiteSpace(value: string | undefined): boolean {
  const reWhiteSpace = new RegExp('\\s+');

  if (value !== undefined && reWhiteSpace.test(value)) {
    return true;
  }
  return false;
}
