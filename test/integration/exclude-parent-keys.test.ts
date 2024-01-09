import { expect } from '@esm-bundle/chai';
import { promises } from 'fs';
import path from 'path';
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
    expect(error).to.include('Problems were found when trying to resolve property references');
  });

  it('optionally excludes parent keys', async () => {
    transformOpts = {
      excludeParentKeys: true,
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
