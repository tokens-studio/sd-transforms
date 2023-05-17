export function isNothing(value: string | null | undefined): boolean {
  if (value == null || value === '') {
    return true;
  }
  return false;
}
