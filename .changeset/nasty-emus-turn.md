---
'@tokens-studio/sd-transforms': minor
---

BREAKING: Register ts/opacity transform, to transform opacity to number between 0 and 1, which is more multi-platform than percentages%. Breaking because people might not expect to have their opacity tokens suddenly as decimal numbers.
