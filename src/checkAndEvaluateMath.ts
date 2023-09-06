import { Parser } from 'expr-eval';
import { parse, reduceExpression } from 'postcss-calc-ast-parser';

const mathChars = ['+', '-', '*', '/'];

const parser = new Parser();

function checkIfInsideGroup(expr: string, fullExpr: string): boolean {
  // make sure all regex-specific characters are escaped by backslashes
  const exprEscaped = expr.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  // Reg which checks whether the sub expression is fitted inside of a group ( ) in the full expression
  const reg = new RegExp(`\\(.*?${exprEscaped}.*?\\)`, 'g');
  return !!fullExpr.match(reg) || !!expr.match(/\(/g); // <-- latter is needed because an expr piece might be including the opening '(' character
}

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
  // indexes in the string at which a space separator exists that is a multi-value space separator
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
      checkIfInsideGroup(tok, expr), // exprs that aren't math expressions are okay within ( ) groups
    ];

    if (conditions.every(cond => !cond)) {
      if (!skipNextIteration) {
        indexes.push(i);
        // if the current token itself does not also contain a math character
        // make sure we skip the next iteration, because otherwise the conditions
        // will be all false again for the next char which is essentially a "duplicate" hit
        // meaning we would unnecessarily push another index to split our multi-value by
        if (!mathChars.find(char => tok.includes(char))) {
          skipNextIteration = true;
        }
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

function parseAndReduce(expr: string): string | boolean | number {
  // We check for px unit, then remove it
  const hasPx = expr.match('px');
  let unitlessExpr = expr.replace(/px/g, '');
  // Remove it here so we can evaluate expressions like 16px + 24px
  const calcParsed = parse(unitlessExpr, { allowInlineCommnets: false });

  // Attempt to reduce the math expression
  const reduced = reduceExpression(calcParsed);
  let unit;

  // E.g. if type is Length, like 4 * 7rem would be 28rem
  if (reduced && reduced.type !== 'Number') {
    unitlessExpr = `${reduced.value}`.replace(new RegExp(reduced.unit, 'ig'), '');
    unit = reduced.unit;
  }

  // Try to evaluate expression (minus unit) with expr-eval
  let evaluated;
  try {
    evaluated = parser.evaluate(unitlessExpr);
    if (typeof evaluated !== 'number') {
      return expr;
    }
  } catch (ex) {
    return expr;
  }

  const formatted = Number.parseFloat(evaluated.toFixed(3));
  // Put back the px unit if needed and if reduced doesn't come with one
  const formattedUnit = unit ?? (hasPx ? 'px' : '');

  // This ensures stringification is not done when not needed (e.g. type number or boolean kept intact)
  return formattedUnit ? `${formatted}${formattedUnit}` : formatted;
}

export function checkAndEvaluateMath(
  expr: string | number | boolean | undefined,
): string | number | boolean | undefined {
  if (expr === undefined || typeof expr === 'boolean') {
    return expr;
  }
  const exprs = splitMultiIntoSingleValues(`${expr}`);
  const reducedExprs = exprs.map(_expr => parseAndReduce(_expr));
  if (reducedExprs.length === 1) {
    return reducedExprs[0];
  }
  return reducedExprs.join(' ');
}
