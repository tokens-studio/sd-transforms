import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';
import path from 'path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/sd-transforms.tokens.json'],
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

let dict: StyleDictionary.Core | undefined;

describe('sd-transforms smoke tests', () => {
  beforeEach(() => {
    if (dict) {
      cleanup(dict);
    }
    dict = init(cfg, { 'ts/color/modifiers': { format: 'hex' } });
  });

  afterEach(() => {
    if (dict) {
      cleanup(dict);
    }
  });

  it('supports tokens-studio tokens', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`:root {
  --sdDimensionScale: 2;
  --sdDimensionXs: 4px;
  --sdDimensionSm: 8px;
  --sdDimensionMd: 16px;
  --sdDimensionLg: 32px;
  --sdDimensionXl: 64px;
  --sdOpacity: 0.25;
  --sdSpacingSm: 8px;
  --sdSpacingXl: 64px;
  --sdSpacingMultiValue: 8px 64px; /* You can have multiple values in a single spacing token. Read more on these: https://docs.tokens.studio/available-tokens/spacing-tokens#multi-value-spacing-tokens */
  --sdColorsBlack: #000000;
  --sdColorsWhite: #ffffff;
  --sdColorsBlue: #0000FF;
  --sdColorsBlueAlpha: rgba(0, 0, 255, 0.5);
  --sdColorsRed400: #f67474;
  --sdColorsRed500: #f56565;
  --sdColorsRed600: #dd5b5b;
  --sdLineHeightsHeading: 1.1;
  --sdLineHeightsBody: 1.4;
  --sdLetterSpacingDefault: 0;
  --sdLetterSpacingIncreased: 1.5em;
  --sdLetterSpacingDecreased: -0.05em;
  --sdFontWeightsHeadingRegular: 600;
  --sdFontWeightsHeadingBold: 700;
  --sdFontWeightsBodyRegular: 400;
  --sdFontSizesH6: 16px;
  --sdFontSizesBody: 16px;
  --sdHeading6: 700 16px/1 Arial;
  --sdShadowBlur: 10px;
  --sdShadow: inset 0 4px 10px 0 rgba(0,0,0,0.4);
  --sdBorderWidth: 5px;
  --sdBorder: 5px solid #000000;
  --sdColor: #FF00FF;
  --sdUsesColor: rgba(255, 0, 255, 1);
}`);
  });
});
