export function isCommaSeperated(value: string | undefined | number): boolean {
  if (typeof value == 'number') {
    return false;
  }
  if (value !== undefined && value.includes(',')) {
    return true;
  }
  return false;
}
