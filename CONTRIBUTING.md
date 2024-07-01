# Contributing Guidelines

Any contribution is greatly appreciated. If you feel like you lack knowledge/experience, even just creating a good issue with a minimal reproduction is already huge.
If you can create a PR with a failing test showing the bug you found, even better, don't worry about putting the test in the perfect location but as a rule of thumb, if your bug is only reproducible in combination with Style Dictionary, put it in the `test/integration`, if it's more isolated to sd-transforms you can put it in `test/spec` folder.

Is TypeScript not your strength and having issues? No problem, just do what you can and I'll help you fix whatever's broken in the PR.

## Tests

Unit tests should provide 100% coverage. Use:

```sh
npm run test
npm run test:unit:coverage
```

To run the tests and view the coverage report, to see which things are untested.

If some line of code really cannot be covered by a test or just doesn't make sense, [see here how to ignore them](https://modern-web.dev/docs/test-runner/writing-tests/code-coverage/#ignoring-uncovered-lines).

> 100% may seem a bit crazy, but just know that it's a lot easier to retain 100% than to get it for the first time ;)
> The biggest benefit to 100% is that it makes it very easy to identify redundant code; if it's redundant, it won't be covered.

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
