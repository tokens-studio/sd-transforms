import StyleDictionary from 'style-dictionary';
import { expect } from 'chai';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, init, excerpt } from './utils.js';

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

let dict: StyleDictionary | undefined;

describe('typography references', () => {
  beforeEach(async () => {
    if (dict) {
      cleanup(dict);
    }
    dict = await init(cfg, { withSDBuiltins: false });
  });

  afterEach(async () => {
    if (dict) {
      await cleanup(dict);
    }
  });

  it('supports references inside color modifiers', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: ':root {', end: '--sdModifier' });
    const expectedOutput = `--sdAlpha: 0.3;
--sdColor: #ffffff4d;`;
    expect(content).to.equal(expectedOutput);
  });

  it('supports color modifier that is a reference itself, containing another reference', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: '--sdModifier: [object Object];', end: '}' });
    const expectedOutput = `--sdColor2: #0000004d;`;
    expect(content).to.equal(expectedOutput);
  });
});
