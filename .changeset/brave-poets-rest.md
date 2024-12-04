---
'@tokens-studio/sd-transforms': patch
---

Fix `ts/size/px` transform to handle multi-value token values such as `'button.padding': { value: '4 8' }`.
