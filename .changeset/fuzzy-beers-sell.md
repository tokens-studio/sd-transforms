---
'@tokens-studio/sd-transforms': minor
---

BREAKING: swap expandComposites 2nd argument and 3rd argument. 2nd argument is now TransformOptions and 3rd argument the filePath (string). This used to be vice versa and was inconsistent with the other parser functions.
