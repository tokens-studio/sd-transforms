import { Parser } from 'expr-eval-fork';
import { DesignToken } from 'style-dictionary/types';
import { defaultFractionDigits } from './utils/constants.js';
import { MathExprEvalError, MixedUnitsExpressionError } from './utils/errors.js';
import { parseUnits } from './utils/parseUnits.js';
import { reduceToFixed } from './utils/reduceToFixed.js';

const parser = new Parser();

export function evaluateMathExpr(expr: string, fractionDigits: number): string | number {
  const isAlreadyNumber = !isNaN(Number(expr));
  if (isAlreadyNumber) {
    return expr;
  }

  const { units, unitlessExpr } = parseUnits(expr);

  // Remove unitless "unit" from the units set to count the number of units
  const noUnitlessUnits = units.difference(new Set(['']));
  if (noUnitlessUnits.size > 1) {
    throw new MixedUnitsExpressionError({ units });
  }
  // Since there's no unit mixing allowed we can take the first item out of the units set as the output unit
  const resultUnit: string | null = [...noUnitlessUnits][0];

  let evalResult: number;
  try {
    evalResult = parser.evaluate(unitlessExpr);
  } catch (exception) {
    throw new MathExprEvalError({
      value: unitlessExpr,
      exception: exception instanceof Error ? exception : undefined,
    });
  }

  const fixedNum = reduceToFixed(evalResult, fractionDigits);
  const result = resultUnit ? `${fixedNum}${resultUnit}` : fixedNum;
  return result;
}

export function strictCheckAndEvaluateMath(
  token: DesignToken,
  fractionDigits = defaultFractionDigits,
): DesignToken['value'] {
  const expr = token.$value ?? token.value;

  if (!['string'].includes(typeof expr)) {
    return expr;
  }

  return evaluateMathExpr(expr, fractionDigits);
}
