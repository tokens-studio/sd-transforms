// We have to manually ESMify this library.
// @rollup/plugin-commonjs inside @web/test-runner doesn't work / creates errors
// @ts-ignore
import { parse, reduceExpression } from './postcss-calc-ast-parser';

const mathChars = ['+', '-', '*', '/'];

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
      exprArr.push(singleValue);
      currIndex = i + 1;
    });
    return exprArr;
  }
  return [expr];
}

function parseAndReduce(expr: string): string {
  const calcParsed = parse(expr, {});

  const reduced = reduceExpression(calcParsed);
  if (reduced === null) {
    return expr;
  }

  const unit = reduced['unit'];
  return `${Number.parseFloat(reduced.value.toFixed(3))}${unit ?? ''}`;
}

export function checkAndEvaluateMath(expr: string): number | string {
  const exprs = splitMultiIntoSingleValues(expr);
  const reducedExprs = exprs.map(_expr => parseAndReduce(_expr));
  return reducedExprs.join(' ');
}
