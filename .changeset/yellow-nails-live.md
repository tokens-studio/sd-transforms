---
'@tokens-studio/sd-transforms': major
---

- BREAKING: Compatible with Style Dictionary >= v4.0.0. Not compatible with anything below that SD version.

- BREAKING: `registerTransforms` function has been renamed to `register`.

- BREAKING: `transforms` array has been refactored to `getTransforms()`, which is a function you should call. Optionally pass in the new platform option as parameter `{ platform: 'css' /* or 'compose' */}`

- BREAKING: By default, registered `tokens-studio` transformGroup will include the platform's Style Dictionary built-in transforms. E.g. if you're registering for platform `css` it will include the `css` transformGroup transforms from Style Dictionary, appended to the Tokens Studio specific transforms. This behavior can be disabled by passing `{ withSDBuiltins: false }`.

- Allow passing platform to the `register()` call: `register(SD, { platform: 'compose' })`. Default value is `'css'`. This means your `tokens-studio` group will be registered for that specific platform.

- Allow passing `name` to the `register()` call to configure the transformGroup name: `register(SD, { name: 'tokens-studio-css' })`. Default value is `tokens-studio`.
