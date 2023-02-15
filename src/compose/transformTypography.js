/**
 * Helper: Transforms typography object to typography shorthand for Jetpack Compose
 *
 * @param {Record<string, string>} token
 */
export function transformTypographyForCompose(token) {
  /**
   * Mapping between https://docs.tokens.studio/available-tokens/typography-tokens
   * and https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextStyle
   * Unsupported property:
   *  - paragraphSpacing
   */
  const textStylePropertiesMapping = {
    fontFamily: "fontFamily",
    fontWeight: "fontWeight",
    lineHeight: "lineHeight",
    fontSize: "fontSize",
    letterSpacing: "letterSpacing",
    paragraphIndent: "textIndent",
  };

  /**
   * Constructs a `TextStyle`, e.g.
   * TextStyle(
   *  fontSize = 16.dp
   * )
   */
  return `${Object.entries(token.value).reduce((props, [propName, val]) => {
    let output = props;
    if (textStylePropertiesMapping[propName]) {
      output += `${textStylePropertiesMapping[propName]} = ${val}\n`;
    }
    return output;
  }, "TextStyle(\n")})`
}
