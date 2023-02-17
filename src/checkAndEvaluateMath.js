import { parse, reduceExpression } from './postcss-calc-ast-parser.js';

/**
 * @typedef {import('postcss-calc-ast-parser/dist/types/ast').Root} Root
 */

const mathChars = ['+', '-', '*', '/'];

/**
 * Checks expressions like: 8 / 4 * 7px 8 * 5px 2 * 4px
 * and divides them into 3 single values:
 * ['8 / 4 * 7px', '8 * 5px', '2 * 4px']
 *
 * It splits everything by " " spaces, then checks in which places
 * there is a space but with no math operater left or right of it,
 * then determines this must mean it's a multi-value separator
 *
 * @param {string} expr
 * @returns {string[]}
 */
function splitMultiIntoSingleValues(expr) {
  const tokens = expr.split(' ');
  /** @type {number[]} */
  const indexes = [];
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
    /** @type {string[]} */
    const exprArr = [];
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

/**
 * @param {string} expr
 * @returns {string}
 */
function parseAndReduce(expr) {
  /** @type {Root} */
  const calcParsed = /** @type {Root} */ (parse(expr));

  const reduced = reduceExpression(calcParsed);
  if (reduced === null) {
    return expr;
  }
  return `${Number.parseFloat(reduced.value.toFixed(3))}${reduced.unit ?? ''}`;
}

/**
 *
 * @param {string} expr
 * @returns {number|string}
 */
export function checkAndEvaluateMath(expr) {
  const exprs = splitMultiIntoSingleValues(expr);
  const reducedExprs = exprs.map(_expr => parseAndReduce(_expr));
  return reducedExprs.join(' ');
}
