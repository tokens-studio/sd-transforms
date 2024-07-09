---
'@tokens-studio/sd-transforms': minor
---

Properly split fontWeight tokens that contain fontStyle into the parent group. For typography tokens this was correct but for fontWeight tokens, collision could occur between the token and its sibling tokens.
