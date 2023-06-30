---
'@tokens-studio/sd-transforms': patch
---

Add value transform `ts/typography/css/fontFamily` to font-families which adds quotes if it has white space. The source
value will then match with how it's rendered in the composite typography token value. `outputReferences: true` will now replace
the quoted value with the reference. Previously, the reference was wrapped in quotes.
