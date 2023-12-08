import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';
import path from 'path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/output-references.tokens.json'],
  platforms: {
    css: {
      transforms: ['ts/resolveMath', 'name/cti/kebab'],
      prefix: 'sd',
      buildPath: outputDir,
      files: [
        {
          destination: outputFileName,
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};

let dict: StyleDictionary.Core | undefined;

describe('outputReferences integration', () => {
  beforeEach(async () => {
    await cleanup(dict);
    dict = await init(cfg);
  });

  afterEach(async () => {
    await cleanup(dict);
  });

  it('supports outputReferences with resolveMath', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`--sd-my-base-token: 11;`);
    expect(file).to.include(`--sd-my-reference-token: var(--sd-my-base-token);`);
  });

  // Pending Style-Dictionary v3 release with the new outputReferences fixes
  it.skip('supports outputReferences with resolveMath when evaluating an expression', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`--sd-transformed-base-token: 4;`);
    expect(file).to.include(`--sd-transformed-reference-token: 5 * var(--sd-my-base-token);`);
  });
});
