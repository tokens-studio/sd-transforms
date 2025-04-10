import type StyleDictionary from 'style-dictionary';
import { describe, beforeEach, afterEach, expect, it } from 'vitest';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, excerpt, init } from './utils.js';

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
    const expectedOutput1 = `--sd-my-base-token: 11;`;
    const expectedOutput2 = `--sd-my-reference-token: var(--sd-my-base-token);`;
    const content1 = excerpt(file, {
      start: ':root {',
      end: '--sd-transformed-base-token: 4;',
    });
    const content2 = excerpt(file, {
      start: '--sd-transformed-base-token: 4;',
      end: '--sd-transformed-reference-token: var(--sd-my-base-token) * 5;',
    });
    expect(content1).toBe(expectedOutput1);
    expect(content2).toBe(expectedOutput2);
  });

  it('supports outputReferences with resolveMath when evaluating an expression', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const expectedOutput1 = `--sd-transformed-base-token: 4;`;
    const expectedOutput2 = `--sd-transformed-reference-token: var(--sd-my-base-token) * 5;`;
    const content1 = excerpt(file, {
      start: '--sd-my-base-token: 11;',
      end: '--sd-my-reference-token: var(--sd-my-base-token);',
    });
    const content2 = excerpt(file, {
      start: '--sd-my-reference-token: var(--sd-my-base-token);',
      end: '}',
    });
    expect(content1).toBe(expectedOutput1);
    expect(content2).toBe(expectedOutput2);
  });
});
