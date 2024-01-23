import type StyleDictionary from 'style-dictionary';
import { expect } from '@esm-bundle/chai';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/math-in-complex-values.tokens.json'],
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
    expect(file).to.include(`--sdTypo: 400 24px/1.125 'Arial Black';`);
  });

  it('supports border tokens with math width and hexrgba color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`--sdBorder: 24px dashed rgba(255, 255, 0, 0.5);`);
  });

  it('supports box shadow tokens with math dimensions, hexrgba color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`--sdShadowSingle: inset 0 4px 10px 0 rgba(0, 0, 0, 0.4);`);
    expect(file).to.include(
      `--sdShadowDouble: inset 0 4px 10px 0 rgba(0, 0, 0, 0.4), inset 0 4px 10px 0 rgba(255, 255, 255, 0.2);`,
    );
  });
});
