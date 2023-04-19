import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
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
let dict: StyleDictionary.Core | undefined;

function before() {
  if (dict) {
    cleanup(dict);
  }
  dict = init(cfg, transformOpts);
}

function after() {
  if (dict) {
    cleanup(dict);
  }
}

describe('exclude parent keys', () => {
  afterEach(() => {
    after();
  });

  it('does not expand parent keys by default and throws on broken references', async () => {
    expect(before).to.throw('Problems were found when trying to resolve property references');
  });

  it('optionally excludes parent keys', async () => {
    transformOpts = {
      excludeParentKeys: true,
    };
    before();

    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdCoreColor: #FFFFFF;
  --sdSemanticColor: #FFFFFF;
  --sdButtonColor: #FFFFFF;`,
    );
  });
});
