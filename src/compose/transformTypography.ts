import { transformFontWeights } from '../transformFontWeights';

/**
 * Helper: Transforms typography object to typography shorthand for Jetpack Compose
 */
export function transformTypographyForCompose(
  value: Record<string, string> | undefined,
): string | undefined {
  if (value === undefined) {
    return value;
  }

  /**
   * Mapping between https://docs.tokens.studio/available-tokens/typography-tokens
   * and https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextStyle
   * Unsupported property:
   *  - paragraphSpacing
   */
  const textStylePropertiesMapping = {
    fontFamily: 'fontFamily',
    fontWeight: 'fontWeight',
    lineHeight: 'lineHeight',
    fontSize: 'fontSize',
    letterSpacing: 'letterSpacing',
    paragraphIndent: 'textIndent',
  };

  /**
   * Constructs a `TextStyle`, e.g.
   * TextStyle(
   *  fontSize = 16.dp
   * )
   */
  return `${Object.entries(value).reduce(
    (acc, [propName, val]) =>
      `${acc}${
        textStylePropertiesMapping[propName]
          ? `${propName === 'fontWeight' ? transformFontWeights(val) : val}\n`
          : ''
      }`,
    'TextStyle(\n',
  )})`;
}
