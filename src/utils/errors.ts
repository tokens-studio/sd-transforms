import type { Units } from './parseUnits.ts';

export class MixedUnitsExpressionError extends Error {
  units: Units;

  constructor({ units }: { units: Units }) {
    super('Mixed units found in expression');
    this.name = 'MixedUnitsExpressionError';
    this.units = units;
  }
}

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
