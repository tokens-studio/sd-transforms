---
'@tokens-studio/sd-transforms': minor
---

BREAKING: remove options `addAttributeCTI` & `casing`.
Since `transformGroup` can now be combined with `transforms`, this is now much easier to accomplish in Style-Dictionary without additional sd-transforms options.

Before:

```js
registerTransforms(StyleDictionary, { addAttributeCTI: true, casing: 'kebab' });
```

After:

```json
{
  "platforms": {
    "css": {
      "transformGroup": "tokens-studio",
      "transforms": ["attribute/cti", "name/kebab"]
    }
  }
}
```

> From this version onwards, Style-Dictionary v4.0.0-prerelease.19 minimum is required.
