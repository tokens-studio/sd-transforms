import { run, config as calcConfig } from '@tokens-studio/unit-calculator';
import type { IUnitValue } from '@tokens-studio/unit-calculator';
import { Parser } from 'expr-eval-fork';
import { DesignToken } from 'style-dictionary/types';
import { defaultFractionDigits } from './utils/constants.js';
import { MathExprEvalError } from './utils/errors.js';
import { reduceToFixed } from './utils/reduceToFixed.js';
import { transformByTokenType } from './utils/transformByTokenType.js';

const { roundTo } = new Parser().functions;

export const defaultCalcConfig = {
  ...calcConfig.defaultConfig,
  mathFunctions: {
    ...calcConfig.defaultMathFunctions,
    roundTo: (a: IUnitValue, b: IUnitValue) => {
      const value = roundTo(a.value, b.value);
      return { value, unit: a.unit };
    },
  },
};

export interface MathOptions {
  fractionDigits: number;
  calcConfig?: calcConfig.CalcConfig;
}

export function evaluateMathExpr(
  expr: string,
  { fractionDigits, calcConfig }: MathOptions,
): string | number {
  try {
    const parsed = run(expr, calcConfig);
    const values = parsed.exec().map(function (result) {
      const { value, unit } = result;
      const fixedValue = typeof value === 'number' ? reduceToFixed(value, fractionDigits) : value;
      return unit ? `${fixedValue}${unit}` : fixedValue;
    });
    return values.length > 1 ? values.join(' ') : values[0];
  } catch (exception) {
    throw new MathExprEvalError({
      value: expr,
      exception: exception instanceof Error ? exception : undefined,
    });
  }
}

export function strictCheckAndEvaluateMath(
  token: DesignToken,
  options: Partial<MathOptions> = {},
): DesignToken['value'] {
  const opts: MathOptions = {
    fractionDigits: options.fractionDigits ?? defaultFractionDigits,
    calcConfig: options.calcConfig ?? defaultCalcConfig,
  };

  const expr = token.$value ?? token.value;
  const type = token.$type ?? token.type;

  if (!['string', 'object'].includes(typeof expr)) {
    return expr;
  }

  const resolveMath = (expr: DesignToken['value']) => {
    if (typeof expr !== 'string') return expr;
    return evaluateMathExpr(expr, opts);
  };

  return transformByTokenType(expr, type, resolveMath);
}
