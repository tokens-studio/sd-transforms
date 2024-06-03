import { DesignToken } from 'style-dictionary/types';
import { transformFontWeight } from '../transformFontWeight.js';

/**
 * Helper: Transforms typography object to typography shorthand for Jetpack Compose
 */
export function transformTypographyForCompose(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  if (val === undefined) return undefined;

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
  return `${Object.entries(val).reduce(
    (acc, [propName, v]) =>
      `${acc}${
        textStylePropertiesMapping[propName]
          ? `${
              propName === 'fontWeight'
                ? transformFontWeight({
                    value: v,
                  })
                : v
            }\n`
          : ''
      }`,
    'TextStyle(\n',
  )})`;
}
