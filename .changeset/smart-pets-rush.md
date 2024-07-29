---
'@tokens-studio/sd-transforms': patch
---

textCase and textDecoration types should be kept, instead of changing to "other". This should help with transforms targeting those tokens, whereas "other" is not a useful type conversion whatsoever.
