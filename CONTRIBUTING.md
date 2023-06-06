# Contributing Guidelines

Things to know before contributing:

## Tests

Unit tests should provide 100% coverage. Use:

```sh
npm run test
npm run test:unit:coverage
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
