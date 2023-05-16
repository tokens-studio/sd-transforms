---
'@tokens-studio/sd-transforms': patch
---

Exclude parent keys can lead to duplicate property keys. Ensure they are deepmerged instead of overwritten.
