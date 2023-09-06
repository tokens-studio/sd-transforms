---
'@tokens-studio/sd-transforms': patch
---

Handle fonts that put only fontStyle inside fontWeight properly e.g. "Italic", which should resolve to weight "Regular" and style "Italic".
