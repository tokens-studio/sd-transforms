# Contributing Guidelines

Things to know before contributing:

## ESMify postcss-calc-ast-parser & deepmerge

We use postcss-calc-ast-parser to evaluate math expressions inside token values.
We use deepmerge to merge objects together.
These modules are CommonJS only, so it doesn't work in browser environments.

This is only a problem of the format, so it's easily fixed by using a bundler to format it to ESM.
Run:

```sh
npm run build
```

before doing things like linting, testing etc., or you will get errors.

## Tests

Unit tests should provide 100% coverage. Use:

```sh
npm run test
npm run test:view:coverage
```

To run the tests and view the coverage report, to see which things are untested.

If some line of code really cannot be covered by a test or just doesn't make sense, [see here how to ignore them](https://modern-web.dev/docs/test-runner/writing-tests/code-coverage/#ignoring-uncovered-lines).

## Linting

This checks code quality with ESLint, formatting with Prettier and types with TypeScript.
VSCode extensions for ESLint/Prettier are recommended, but you can always run:

```sh
npm run format
```

after doing your work, to fix most issues automatically.

## Versioning

We use [changesets](https://github.com/changesets/changesets) for versioning. If you are contributing something that warrants a new release of this library, run `npx changeset` and follow the CLI prompts and add a human readable explanation of your change.

## Contact

For new ideas, feature requests, issues, bugs, etc., use GitHub issues.
Also, feel free to reach out to us on [Slack](https://join.slack.com/t/tokens-studio/shared_invite/zt-1p8ea3m6t-C163oJcN9g3~YZTKRgo2hg).
