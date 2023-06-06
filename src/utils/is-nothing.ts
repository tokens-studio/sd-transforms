export function isNothing(value: string | number | null | undefined): boolean {
  if (value == null || value === '') {
    return true;
  }
  return false;
}
