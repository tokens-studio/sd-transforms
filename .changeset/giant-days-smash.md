---
'@tokens-studio/sd-transforms': major
---

BREAKING: `descriptionToComment` transform no longer removes newlines, just turns carriage returns into newlines. Style Dictionary now handles comments with newlines properly in its createPropertyFormatter utility.
