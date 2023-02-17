---
'@tokens-studio/sd-transforms': patch
---

Change regex for HEXRGBa detection space character from lazy to greedy, to more tightly match the "alpha" number without leading spaces.
