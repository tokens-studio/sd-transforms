import type StyleDictionary from 'style-dictionary';
import { describe, beforeEach, afterEach, expect, it } from 'vitest';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, excerpt, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/cross-file-refs-*.tokens.json'],
  expand: true,
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

describe('cross file references', () => {
  beforeEach(async () => {
    cleanup(dict);
    dict = await init(cfg, {
      withSDBuiltins: false,
    });
  });

  afterEach(async () => {
    await cleanup(dict);
  });

  it('supports cross file references e.g. expanding typography', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: ':root {', end: '}' });
    const expectedOutput = `--sdTypoFontWeight: 400;
--sdTypoFontStyle: italic;
--sdPrimaryFont: Inter;
--sdFontWeight: 800;
--sdLineHeight: 1.5;
--sdTypo2FontFamily: Inter;
--sdTypo2FontWeight: 800;
--sdTypo2LineHeight: 1.5;
--sdTypo2FontSize: 8px;
--sdDimensionScale: 2;
--sdDimensionXs: 4px;
--sdTestCompositeFancyCardColor: #fff;
--sdTestCompositeFancyCardBorderRadius: 18px;
--sdTestCompositeFancyCardBorderColor: #999;
--sdTestCompositeCardColor: #fff;
--sdTestCompositeCardBorderRadius: 18px;
--sdTestCompositeCardBorderColor: #999;
--sdTestTypographyFancyTextFontFamily: Arial;
--sdTestTypographyFancyTextFontSize: 25px;
--sdTestTypographyFancyTextLineHeight: 32px;
--sdTestTypographyFancyTextFontWeight: 700;
--sdTestTypographyTextFontFamily: Arial;
--sdTestTypographyTextFontSize: 25px;
--sdTestTypographyTextLineHeight: 32px;
--sdTestTypographyTextFontWeight: 700;
--sdWeightWeight: 400;
--sdWeightStyle: italic;
--sdTypoAliasFontWeight: 400;
--sdTypoAliasFontStyle: italic;
--sdTypo3FontFamily: Inter;
--sdTypo3FontWeight: 800;
--sdTypo3LineHeight: 1.5;
--sdTypo3FontSize: 8px;`;
    expect(content).toBe(expectedOutput);
  });
});
