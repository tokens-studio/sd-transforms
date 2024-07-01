---
'@tokens-studio/sd-transforms': major
---

BREAKING: remove CSS shorthand transforms for border, typography and shadow. Use the Style Dictionary transforms instead: https://styledictionary.com/reference/hooks/transforms/predefined/#bordercssshorthand.

Note that if you're not disabling the `withSDBuiltins` option, the `tokens-studio` transformGroup will include the ones in the `css` built-in transformGroup, so you might not notice the fact that they are moved.
