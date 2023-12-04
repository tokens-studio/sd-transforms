---
'@tokens-studio/sd-transforms': minor
---

BREAKING: remove code that allowed user to not pass StyleDictionary instance to registerTransforms, and grabbed the locally installed StyleDictionary automatically. This seemed like a cool feature at first, but can cause hard to trace bugs if there are multiple installations of style-dictionary (due to incompatible semver).
