---
'@tokens-studio/sd-transforms': minor
---

Add the `originalType` property to `$extensions.['studio.tokens']` to store the original Tokens Studio token type, when the type is aligned to DTCG types. LetterSpacing transform is the transform in this package that actually needs to use this, because it doesn't want to match all dimension tokens, but it does want to match letterSpacing tokens.
