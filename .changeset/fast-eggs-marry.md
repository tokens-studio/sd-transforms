---
'@tokens-studio/sd-transforms': patch
---

Revert back change that throws fatal error for broken references when expanding tokens or adding fontStyle. To keep compatibility with Style-Dictionary v3.
[See the issue describing the problem and necessary workaround for v3](https://github.com/tokens-studio/sd-transforms/issues/217).
