---
'@tokens-studio/sd-transforms': patch
---

Patches the transformHEXRGBa function to allow for whitespaces surrounding the HEX code. The Tokens Studio plugin automatically adds these whitespaces when working with aliases so this patch removes the need for manually having to remove those whitespaces.
