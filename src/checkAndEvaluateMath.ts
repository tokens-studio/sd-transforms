import { DesignToken } from 'style-dictionary/types';
import { Parser } from 'expr-eval-fork';
import { parse, reduceExpression } from '@bundled-es-modules/postcss-calc-ast-parser';

const defaultFractionDigits = 4;
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
      Boolean(tok.match(/\)$/) && mathChars.includes(right)), // end of group ), right is math char
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

function parseAndReduce(expr: string, fractionDigits = defaultFractionDigits): string | number {
  let result: string | number = expr;

  let evaluated;
  // Try to evaluate as expr-eval expression
  try {
    evaluated = parser.evaluate(`${result}`);
    if (typeof evaluated === 'number') {
      result = evaluated;
    }
  } catch (ex) {
    //
  }

  // We check for px unit, then remove it, since these are essentially numbers in tokens context
  // We remember that we had px in there so we can put it back in the end result
  const hasPx = expr.match('px');
  const noPixExpr = expr.replace(/px/g, '');
  const unitRegex = /(\d+\.?\d*)(?<unit>([a-zA-Z]|%)+)/g;

  let matchArr;
  const foundUnits: Set<string> = new Set();
  while ((matchArr = unitRegex.exec(noPixExpr)) !== null) {
    if (matchArr?.groups) {
      foundUnits.add(matchArr.groups.unit);
    }
  }
  // multiple units (besides px) found, cannot parse the expression
  if (foundUnits.size > 1) {
    return result;
  }
  const resultUnit = Array.from(foundUnits)[0] ?? (hasPx ? 'px' : '');

  // Remove it here so we can evaluate expressions like 16px + 24px
  const calcParsed = parse(noPixExpr, { allowInlineCommnets: false });

  // No expression to evaluate, just return it (in case of number as string e.g. '10')
  if (calcParsed.nodes.length === 1 && calcParsed.nodes[0].type === 'Number') {
    return `${result}`;
  }

  // Attempt to reduce the math expression
  const reduced = reduceExpression(calcParsed);
  // E.g. if type is Length, like 4 * 7rem would be 28rem
  if (reduced) {
    result = reduced.value;
  }

  if (typeof result !== 'number') {
    return result;
  }

  // the outer Number() gets rid of insignificant trailing zeros of decimal numbers
  const reducedToFixed = Number(Number.parseFloat(`${result}`).toFixed(fractionDigits));
  result = resultUnit ? `${reducedToFixed}${resultUnit}` : reducedToFixed;
  return result;
}

export function checkAndEvaluateMath(
  token: DesignToken,
  fractionDigits?: number,
): DesignToken['value'] {
  const expr = token.$value ?? token.value;
  const type = token.$type ?? token.type;

  if (!['string', 'object'].includes(typeof expr)) {
    return expr;
  }

  const resolveMath = (expr: number | string) => {
    if (typeof expr !== 'string') {
      return expr;
    }
    const exprs = splitMultiIntoSingleValues(expr);
    const reducedExprs = exprs.map(_expr => parseAndReduce(_expr, fractionDigits));
    if (reducedExprs.length === 1) {
      return reducedExprs[0];
    }
    return reducedExprs.join(' ');
  };

  const transformProp = (val: Record<string, number | string>, prop: string) => {
    val[prop] = resolveMath(val[prop]);
    return val;
  };

  let transformed = expr;
  switch (type) {
    case 'typography':
    case 'border': {
      transformed = transformed as Record<string, number | string>;
      // double check that expr is still an object and not already shorthand transformed to a string
      if (typeof expr === 'object') {
        Object.keys(transformed).forEach(prop => {
          transformed = transformProp(transformed, prop);
        });
      }
      break;
    }
    case 'shadow': {
      transformed = transformed as
        | Record<string, number | string>
        | Record<string, number | string>[];
      const transformShadow = (shadowVal: Record<string, number | string>) => {
        // double check that expr is still an object and not already shorthand transformed to a string
        if (typeof expr === 'object') {
          Object.keys(shadowVal).forEach(prop => {
            shadowVal = transformProp(shadowVal, prop);
          });
        }
        return shadowVal;
      };
      if (Array.isArray(transformed)) {
        transformed = transformed.map(transformShadow);
      }
      transformed = transformShadow(transformed);
      break;
    }
    default:
      transformed = resolveMath(transformed);
  }

  return transformed;
}
