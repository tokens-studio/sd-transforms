import type StyleDictionary from 'style-dictionary';
import { expect } from '@esm-bundle/chai';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/output-references.tokens.json'],
  platforms: {
    css: {
      transforms: ['ts/resolveMath', 'name/kebab'],
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

let dict: StyleDictionary | undefined;

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

  it('supports outputReferences with resolveMath when evaluating an expression', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`--sd-transformed-base-token: 4;`);
    expect(file).to.include(`--sd-transformed-reference-token: var(--sd-my-base-token) * 5;`);
  });
});
