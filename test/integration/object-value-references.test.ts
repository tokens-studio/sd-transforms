import type StyleDictionary from 'style-dictionary';
import { expect } from 'chai';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, excerpt, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/object-value-references.tokens.json'],
  preprocessors: ['tokens-studio'],
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

describe('typography references', () => {
  beforeEach(async () => {
    await cleanup(dict);
    dict = await init(cfg);
  });

  afterEach(async () => {
    await cleanup(dict);
  });

  it('supports typography objects when referenced by another token', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      before: `:root {`,
      after: '--sdShadow: 0 4px 10px 0 rgba(0,0,0,0.4), inset 0 8px 10px 4px rgba(0,0,0,0.6);',
    });
    const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, ''); // Remove leading spaces/tabs
    const expectedOutput = `--sdBefore: italic 400 36px/1 'Aria Sans';
--sdFontHeadingXxl: italic 400 36px/1 'Aria Sans';
--sdAfter: italic 400 36px/1 'Aria Sans';`;
    expect(normalizeWhitespace(content)).to.equal(normalizeWhitespace(expectedOutput));
  });

  it('supports boxShadow objects when referenced by another token', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      before: `--sdAfter: italic 400 36px/1 'Aria Sans';`,
      after: '--sdFontWeightRefWeight: 400;',
    });
    const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, ''); // Remove leading spaces/tabs
    const expectedOutput = `--sdShadow: 0 4px 10px 0 rgba(0,0,0,0.4), inset 0 8px 10px 4px rgba(0,0,0,0.6);
--sdShadowRef: 0 4px 10px 0 rgba(0,0,0,0.4), inset 0 8px 10px 4px rgba(0,0,0,0.6);`;
    expect(normalizeWhitespace(content)).to.equal(normalizeWhitespace(expectedOutput));
  });

  it('supports border objects when referenced by another token', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      before: `--sdFontWeightRefStyle: italic;`,
      after: '}',
    });
    const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, ''); // Remove leading spaces/tabs
    const expectedOutput = `--sdBorder: 4px solid #FFFF00;
--sdBorderRef: 4px solid #FFFF00;`;
    expect(normalizeWhitespace(content)).to.equal(normalizeWhitespace(expectedOutput));
  });
});
