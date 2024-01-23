import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { transforms, registerTransforms } from '../../src/index.js';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/custom-group.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'custom/tokens-studio',
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

async function before() {
  cleanup(dict);
  registerTransforms(StyleDictionary);
  StyleDictionary.registerTransformGroup({
    name: 'custom/tokens-studio',
    // remove 'px' appending transform to unitless values
    transforms: transforms.filter(transform => transform !== 'ts/size/px'),
  });
  dict = new StyleDictionary(cfg);
  await dict?.buildAllPlatforms();
}

async function after() {
  await cleanup(dict);
  delete StyleDictionary.transformGroup['custom/tokens-studio'];
}

describe('custom transform group', () => {
  afterEach(async () => {
    await after();
  });

  it('allows easy use of custom transform group with sd-transforms', async () => {
    await before();

    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`--length: 24;`);
  });
});
