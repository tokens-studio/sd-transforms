import { Parser } from 'expr-eval';
import calcAstParser from 'postcss-calc-ast-parser';

/**
 * @typedef {import('postcss-calc-ast-parser/dist/types/ast').Root} Root
 */

const parser = new Parser();

/**
 *
 * @param {string} expr
 * @returns {number|string}
 */
export function checkAndEvaluateMath(expr) {
  /** @type {Root} */
  let calcParsed;
  try {
    calcParsed = calcAstParser.parse(expr);
  } catch (ex) {
    return expr;
  }

  const calcReduced = calcAstParser.reduceExpression(calcParsed);
  let unitlessExpr = expr;
  let unit = '';

  if (calcReduced && calcReduced.type !== 'Number') {
    unitlessExpr = expr.replace(new RegExp(calcReduced.unit, 'ig'), '');
    unit = calcReduced.unit;
  }

  let evaluated;

  try {
    evaluated = parser.evaluate(unitlessExpr);
  } catch (ex) {
    return expr;
  }
  try {
    return unit ? `${evaluated}${unit}` : Number.parseFloat(evaluated.toFixed(3));
  } catch {
    return expr;
  }
}
