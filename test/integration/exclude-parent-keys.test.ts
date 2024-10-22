import { expect } from 'chai';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/exclude-parent-keys.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      prefix: 'sd',
      buildPath: outputDir,
      files: [
        {
          destination: outputFileName,
          format: 'css/variables',
        },
      ],
    },
  },
};
let transformOpts = {};

describe('exclude parent keys', () => {
  beforeEach(async () => {
    await cleanup();
  });

  afterEach(async () => {
    await cleanup();
  });

  it('does not expand parent keys by default and throws on broken references', async () => {
    let error;
    await init(cfg).catch(e => {
      error = e.message;
    });
    expect(error).to.equal(
      '\nReference Errors:\nSome token references (2) could not be found.\nUse log.verbosity "verbose" or use CLI option --verbose for more details.\nRefer to: https://styledictionary.com/reference/logging/\n',
    );
  });

  it('optionally excludes parent keys', async () => {
    transformOpts = {
      excludeParentKeys: true,
      withSDBuiltins: false,
    };
    await init(cfg, transformOpts);
    await cleanup();
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdCoreColor: #FFFFFF;
  --sdSemanticColor: #FFFFFF;
  --sdButtonColor: #FFFFFF;`,
    );
  });
});
