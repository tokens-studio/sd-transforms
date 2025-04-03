import Color from 'colorjs.io';
import { transparentize } from './transparentize.js';
import { mix } from './mix.js';
import { darken } from './darken.js';
import { lighten } from './lighten.js';
import { ColorModifier } from '@tokens-studio/types';
import { parseAndReduce } from '../checkAndEvaluateMath.js';
import { defaultColorPrecision, defaultFractionDigits } from '../utils/constants.js';

// Users using UIColor swift format are blocked from using such transform in
// combination with this color modify transform when using references.
// This is because reference value props are deferred so the UIColor
// transform always applies first to non-reference tokens, and only after that
// can the color modifier transitive transform apply to deferred tokens, at which point
// it is already UIColor format.
// We can remove this hotfix later once  https://github.com/amzn/style-dictionary/issues/1063
// is resolved. Then users can use a post-transitive transform for more fine grained control
function parseUIColor(value: string): string {
  const reg = new RegExp(
    `UIColor\\(red: (?<red>[\\d\\.]+?), green: (?<green>[\\d\\.]+?), blue: (?<blue>[\\d\\.]+?), alpha: (?<alpha>[\\d\\.]+?)\\)`,
  );
  const match = value.match(reg);
  if (match?.groups) {
    const { red, green, blue, alpha } = match.groups;
    return `rgba(${parseFloat(red) * 255}, ${parseFloat(green) * 255}, ${
      parseFloat(blue) * 255
    }, ${alpha})`;
  }
  return value;
}

export function modifyColor(
  baseColor: string | undefined,
  modifier: ColorModifier,
): string | undefined {
  if (baseColor === undefined) {
    return baseColor;
  }

  baseColor = parseUIColor(baseColor);
  const color = new Color(baseColor);
  let returnedColor = color;

  let resolvedMathFractionDigits: number = defaultFractionDigits;
  if (modifier?.mathFractionDigits) {
    resolvedMathFractionDigits = modifier.mathFractionDigits;
  }
  const modifyValueResolvedCalc = Number(
    parseAndReduce(modifier.value, resolvedMathFractionDigits),
  );

  let resolvedColorPrecision: number = defaultColorPrecision;
  if (modifier?.precision) {
    resolvedColorPrecision = modifier.precision;
  }

  try {
    switch (modifier.type) {
      case 'lighten':
        returnedColor = lighten(color, modifier.space, modifyValueResolvedCalc);
        break;
      case 'darken':
        returnedColor = darken(color, modifier.space, modifyValueResolvedCalc);
        break;
      case 'mix':
        returnedColor = mix(
          color,
          modifier.space,
          modifyValueResolvedCalc,
          new Color(modifier.color),
          resolvedColorPrecision,
        );
        break;
      case 'alpha': {
        returnedColor = transparentize(color, modifyValueResolvedCalc);
        break;
      }
      default:
        returnedColor = color;
        break;
    }

    returnedColor = returnedColor.to(modifier.space);

    if (modifier.format && ['lch', 'srgb', 'p3', 'hsl', 'hex'].includes(modifier.format)) {
      // Since hex is not a color space, convert to srgb, toString will then be able to format to hex
      if (modifier.format === 'hex') {
        returnedColor = returnedColor.to('srgb');
      } else {
        returnedColor = returnedColor.to(modifier.format);
      }
    }

    return returnedColor.toString({
      inGamut: true,
      precision: modifier.precision,
      format: modifier.format,
    });
  } catch (e) {
    return baseColor;
  }
}
