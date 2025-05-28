export type Units = Set<string>;

/**
 * Parses units from a math expression and returns an expression with units stripped for further processing.
 * Numbers without units will be represented in the units set with an empty string "".
 */
export function parseUnits(expr: string): { units: Units; unitlessExpr: string } {
  const unitRegex = /(\d+\.?\d*)(?<unit>([a-zA-Z]|%)+)?/g;
  const units: Units = new Set();

  // Find all units in expression
  let matchArr;
  const matches = [];
  while ((matchArr = unitRegex.exec(expr)) !== null) {
    if (matchArr.groups) {
      const unit = matchArr.groups.unit || '';
      if (unit !== null) {
        units.add(unit);
        matches.push({
          start: matchArr.index + matchArr[1].length,
          end: matchArr.index + matchArr[0].length,
          unit,
        });
      }
    }
  }

  // Remove units from expression
  let unitlessExpr = expr;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end } = matches[i];
    unitlessExpr = unitlessExpr.substring(0, start) + unitlessExpr.substring(end);
  }

  return { units, unitlessExpr };
}
