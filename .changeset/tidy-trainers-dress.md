---
'@tokens-studio/sd-transforms': patch
---

Remove the boxShadow expandTypesMap, this is no longer needed since SD 4.0.1 as it runs user defined preprocessors before expanding tokens.
