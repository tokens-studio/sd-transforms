---
'@tokens-studio/sd-transforms': patch
---

Fix `ts/resolveMath` reading `%` as the modulo operator when it is used as a unit. `100% - 8px` was resolved to `4%`; it is now left as is, like other mixed-unit expressions.
