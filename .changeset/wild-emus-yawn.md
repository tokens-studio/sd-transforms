---
'@tokens-studio/sd-transforms': patch
---

No longer need to commit to using @rollup/plugin-commonjs. We prebundle the dependency that is CJS-only so users don't need to worry about it.
