import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';
import path from 'path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/object-value-references.tokens.json'],
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

  it('supports typography objects when referenced by another token', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdBefore: 700 36px/1 'Aria Sans';
  --sdFontHeadingXxl: 700 36px/1 'Aria Sans';
  --sdAfter: 700 36px/1 'Aria Sans';`,
    );
  });

  it('supports boxShadow objects when referenced by another token', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdShadow: inset 0 4px 10px 0 rgba(0,0,0,0.4);
  --sdShadowRef: inset 0 4px 10px 0 rgba(0,0,0,0.4);`,
    );
  });

  it('supports border objects when referenced by another token', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdBorder: 4px solid #FFFF00;
  --sdBorderRef: 4px solid #FFFF00;`,
    );
  });
});
