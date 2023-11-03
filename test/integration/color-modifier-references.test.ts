import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';
import path from 'path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/color-modifier-references.tokens.json'],
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

let dict: StyleDictionary.Core | undefined;

describe('typography references', () => {
  beforeEach(() => {
    if (dict) {
      cleanup(dict);
    }
    dict = init(cfg);
  });

  afterEach(() => {
    if (dict) {
      cleanup(dict);
    }
  });

  it('supports references inside color modifiers', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `--sdAlpha: 0.3;
  --sdColor: #FFFFFF4d;`,
    );
  });
});
