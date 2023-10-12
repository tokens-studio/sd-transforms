---
'@tokens-studio/sd-transforms': patch
---

resolveMath no longer unnecessarily changes the token type to number if the token value is a string without any expressions to resolve.
