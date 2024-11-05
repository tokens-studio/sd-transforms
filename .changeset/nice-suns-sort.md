---
'@tokens-studio/sd-transforms': patch
---

-Made the font weight case insensitive; Extra checks for style and weight values, confusions cleared up in the code; Font style and value are not both mandatory, it is fine if only one is specified; If font style is not provided, the style field will take the weight value; The bug from issue #267 is fixed.
