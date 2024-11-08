import type StyleDictionary from 'style-dictionary';
import { expect } from 'chai';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, excerpt, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/math-in-complex-values.tokens.json'],
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

describe('sd-transforms advanced tests', () => {
  beforeEach(async () => {
    await cleanup(dict);
    dict = await init(cfg);
  });

  afterEach(async () => {
    await cleanup(dict);
  });

  it('supports typography tokens with math or fontweight alias', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      before: ':root {',
      after: '--sdBorder: 24px dashed rgba(255, 255, 0, 0.5);',
    });
    const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, ''); // Remove leading spaces/tabs
    const expectedOutput = `--sdTypo: 400 24px/1.125 'Arial Black';`;
    expect(normalizeWhitespace(content)).to.equal(normalizeWhitespace(expectedOutput));
  });

  it('supports border tokens with math width and hexrgba color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      before: `--sdTypo: 400 24px/1.125 'Arial Black';`,
      after: '--sdShadowSingle: inset 0 4px 10px 0 rgba(0, 0, 0, 0.4);',
    });
    const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, ''); // Remove leading spaces/tabs
    const expectedOutput = `--sdBorder: 24px dashed rgba(255, 255, 0, 0.5);`;
    expect(normalizeWhitespace(content)).to.equal(normalizeWhitespace(expectedOutput));
  });

  it('supports box shadow tokens with math dimensions, hexrgba color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      before: `--sdBorder: 24px dashed rgba(255, 255, 0, 0.5);`,
      after: '}',
    });
    const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, ''); // Remove leading spaces/tabs
    const expectedOutput = `--sdShadowSingle: inset 0 4px 10px 0 rgba(0, 0, 0, 0.4);
--sdShadowDouble: inset 0 4px 10px 0 rgba(0, 0, 0, 0.4), inset 0 4px 10px 0 rgba(255, 255, 255, 0.2);`;
    expect(normalizeWhitespace(content)).to.equal(normalizeWhitespace(expectedOutput));
  });
});
