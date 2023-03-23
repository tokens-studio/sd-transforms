import { Parser } from 'expr-eval';
import { parse, reduceExpression } from './postcss-calc-ast-parser';

const mathChars = ['+', '-', '*', '/'];

const parser = new Parser();

/**
 * Checks expressions like: 8 / 4 * 7px 8 * 5px 2 * 4px
 * and divides them into 3 single values:
 * ['8 / 4 * 7px', '8 * 5px', '2 * 4px']
 *
 * It splits everything by " " spaces, then checks in which places
 * there is a space but with no math operater left or right of it,
 * then determines this must mean it's a multi-value separator
 */
function splitMultiIntoSingleValues(expr: string): string[] {
  // if the full expression is a function value e.g. calc(8px + 12px) or roundTo(4 / 7, 2)
  if (expr.match(/.+?\(.+?\)$/g)) {
    return [expr];
  }
  const tokens = expr.split(' ');
  const indexes = [] as number[];
  let skipNextIteration = false;
  tokens.forEach((tok, i) => {
    const left = i > 0 ? tokens[i - 1] : '';
    const right = tokens[i + 1] ?? '';

    // conditions under which math expr is valid
    const conditions = [
      mathChars.includes(tok), // current token is a math char
      mathChars.includes(right) && mathChars.includes(left), // left/right are both math chars
      left === '' && mathChars.includes(right), // tail of expr, right is math char
      right === '' && mathChars.includes(left), // head of expr, left is math char
      tokens.length <= 1, // expr is valid if it's a simple 1 token expression
    ];

    if (conditions.every(cond => !cond)) {
      if (!skipNextIteration) {
        indexes.push(i);
        skipNextIteration = true;
      } else {
        skipNextIteration = false;
      }
    }
  });
  if (indexes.length > 0) {
    indexes.push(tokens.length);
    const exprArr = [] as string[];
    let currIndex = 0;
    indexes.forEach(i => {
      const singleValue = tokens.slice(currIndex, i + 1).join(' ');
      if (singleValue) {
        exprArr.push(singleValue);
      }
      currIndex = i + 1;
    });
    return exprArr;
  }
  return [expr];
}

function parseAndReduce(expr: string): string {
  // We check for px unit, then remove it
  const hasPx = expr.match('px');
  expr = expr.replace(/px/g, '');
  // Remove it here so we can evaluate expressions like 16px + 24px
  const calcParsed = parse(expr.replace(/px/g, ''), {});

  // Attempt to reduce the math expression
  const reduced = reduceExpression(calcParsed);
  let unitlessExpr = expr;
  let unit;

  // E.g. if type is Length, like 4 * 7rem would be 28rem
  if (reduced && reduced.type !== 'Number') {
    unitlessExpr = expr.replace(new RegExp(reduced.unit, 'ig'), '');
    unit = reduced.unit;
  }

  // Try to evaluate expression (minus unit) with expr-eval
  let evaluated;
  try {
    evaluated = parser.evaluate(unitlessExpr);
  } catch (ex) {
    return expr;
  }

  // Put back the px unit if needed and if reduced doesn't come with one
  return `${Number.parseFloat(evaluated.toFixed(3))}${unit ?? (hasPx ? 'px' : '')}`;
}

export function checkAndEvaluateMath(expr: string | undefined): number | string | undefined {
  if (expr === undefined) {
    return expr;
  }
  const exprs = splitMultiIntoSingleValues(expr);
  const reducedExprs = exprs.map(_expr => parseAndReduce(_expr));
  return reducedExprs.join(' ');
}
