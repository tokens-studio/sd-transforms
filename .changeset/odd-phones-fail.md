---
'@tokens-studio/sd-transforms': major
---

BREAKING: `transformFontWeights` has been renamed to `transformFontWeight` for consistency.

Apply transforms to object-value (composite) token types:

- HEXRGBa transform applies to border and shadow colors
- Px dimension transform applies to border, typography and shadow dimensions
- Letterspacing, lineheights and fontweights transforms apply to these respective typography properties
- Resolve math transform applies to all properties of border, typography and shadow tokens

This also means that all transforms except for description to comment mapping are now transitive transforms, since the math resolve transform must be transitive and all other transforms must apply after the math one.
