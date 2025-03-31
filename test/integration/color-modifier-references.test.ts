import StyleDictionary from 'style-dictionary';
import { describe, beforeEach, afterEach, expect, it } from 'vitest';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, init, excerpt } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

describe('color modifier references', () => {
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
    const expectedOutput = '--sdAlpha: 0.3;\n--sdColor: #ffffff4d;';
    expect(content).toBe(expectedOutput);
  });

  it('supports color modifier that is a reference itself, containing another reference', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      start: '--sdModifier: [object Object];',
      end: '--sdTreshhold',
    });
    const expectedOutput = `--sdColor2: #0000004d;`;
    expect(content).toBe(expectedOutput);
  });

  it('supports color with hardcoded mix value and hardcoded mix color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: new RegExp('--sdMixColor: .*;'), end: '--sdColor4' });
    const expectedOutput = `--sdColor3: #a1bbee;`;
    expect(content).toBe(expectedOutput);
  });

  it('supports color with hardcoded mix value and hardcoded mix color using an expression', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: new RegExp('--sdColor3: .*;'), end: '--sdColor5' });
    const expectedOutput = `--sdColor4: #759ae6;`;
    expect(content).toBe(expectedOutput);
  });

  it('supports color with hardcoded mix value and referenced mix color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: new RegExp('--sdColor4: .*;'), end: '--sdColor6' });
    const expectedOutput = `--sdColor5: #759ae6;`;
    expect(content).toBe(expectedOutput);
  });

  it('supports color with referenced base color and referenced mix color', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: new RegExp('--sdColor5: .*;'), end: '--sdColor7' });
    const expectedOutput = `--sdColor6: #3b64b3;`;
    expect(content).toBe(expectedOutput);
  });

  it('supports color with referenced base color, referenced mix color and reference mix value', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: new RegExp('--sdColor6: .*;'), end: '--sdColor8' });
    const expectedOutput = `--sdColor7: #32528c;`;
    expect(content).toBe(expectedOutput);
  });

  it('supports color with referenced base color, referenced mix color, and expression-based mix value with references', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: new RegExp('--sdColor7: .*;'), end: '--sdColor9' });
    const expectedOutput = `--sdColor8: #3b64b3;`;
    expect(content).toBe(expectedOutput);
  });
});

describe('color modifier platform config mathFractionDigits', () => {
  const cfg = {
    source: ['test/integration/tokens/color-modifier-references.tokens.json'],
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        prefix: 'sd',
        buildPath: outputDir,
        mathFractionDigits: 10,
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

  it('supports platform config math fraction digits', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const contentMorePrecise = excerpt(file, {
      start: new RegExp('--sdColor8: .*;'),
      end: '--sdColor10',
    });
    const expectedOutputMorePrecise = `--sdColor9: rgb(44.287% 59.482% 89.87%);`;
    expect(contentMorePrecise).toBe(expectedOutputMorePrecise);
    const contentLessPrecise = excerpt(file, {
      start: new RegExp('--sdColor9: .*;'),
      end: '--sdColor11',
    });
    const expectedOutputLessPrecise = `--sdColor10: rgb(44.289% 59.483% 89.871%);`;
    expect(contentLessPrecise).toBe(expectedOutputLessPrecise);
  });
});

describe('color modifier platform config color precision', () => {
  const cfg = {
    source: ['test/integration/tokens/color-modifier-references.tokens.json'],
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        prefix: 'sd',
        buildPath: outputDir,
        precision: 8,
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

  it('supports platform config color precision', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const contentMorePrecise = excerpt(file, {
      start: new RegExp('--sdColor10: .*;'),
      end: '--sdColor12',
    });
    const expectedOutputMorePrecise = `--sdColor11: rgb(44.288667% 59.482667% 89.870667%);`;
    expect(contentMorePrecise).toBe(expectedOutputMorePrecise);
    const contentLessPrecise = excerpt(file, { start: new RegExp('--sdColor11: .*;'), end: '}' });
    const expectedOutputLessPrecise = `--sdColor12: rgb(44.3% 59.5% 89.9%);`;
    expect(contentLessPrecise).toBe(expectedOutputLessPrecise);
  });
});
