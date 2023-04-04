---
'@tokens-studio/sd-transforms': minor
---

BREAKING: turn a few of our transforms from transitive to default transforms, if transitive was not necessary:

- `ts/descriptionToComment`
- `ts/size/px`
- `ts/size/css/letterspacing`
- `ts/size/lineheight`
- `ts/type/fontWeight`
