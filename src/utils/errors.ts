export class MathExprEvalError extends Error {
  value: string;
  exception?: Error;

  constructor({ value, exception }: { value: string; exception?: Error }) {
    super('Could not evaluate expression');
    this.name = 'MathExprEvalError';
    this.value = value;
    this.exception = exception;
  }
}
