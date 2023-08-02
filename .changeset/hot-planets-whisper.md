---
'@tokens-studio/sd-transforms': minor
---

checkAndEvaluateMath to not stringify if not needed:

- for single math expressions resolving to a floating number without unit, we can keep it as a `Number`
- for expressions such as `false` or `true` (`Boolean`), keep as `Boolean` type
