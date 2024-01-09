import type StyleDictionary from 'style-dictionary';
import { expect } from '@esm-bundle/chai';
import { promises } from 'fs';
import path from 'path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/cross-file-refs-*.tokens.json'],
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

let dict: StyleDictionary | undefined;

describe('cross file references', () => {
  beforeEach(async () => {
    cleanup(dict);
    dict = await init(cfg, { expand: { typography: true } });
  });

  afterEach(async () => {
    await cleanup(dict);
  });

  it('supports cross file references e.g. expanding typography', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    console.log(file);
    expect(file).to.include(`
  --sdTypoFontWeight: 400;
  --sdTypoFontStyle: italic;
  --sdWeight: 400 italic;
  --sdTypoAliasFontWeight: 400;
  --sdTypoAliasFontStyle: italic;
`);
  });
});
