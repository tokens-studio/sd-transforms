import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';
import path from 'path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/expand-composition.tokens.json'],
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
let transformOpts = {};
let dict: StyleDictionary.Core | undefined;

function before() {
  if (dict) {
    cleanup(dict);
  }
  dict = init(cfg, transformOpts);
}

function after() {
  if (dict) {
    cleanup(dict);
  }
}

describe('expand composition tokens', () => {
  beforeEach(() => {
    before();
  });

  afterEach(() => {
    after();
  });

  it('only expands composition tokens by default', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdCompositionSize: 24px;
  --sdCompositionOpacity: 50%;
  --sdCompositionFontSize: 96px;
  --sdCompositionFontFamily: Roboto;
  --sdCompositionFontWeight: 700;
  --sdCompositionHeaderFontFamilies: Roboto;
  --sdCompositionHeaderFontSizes: 96px;
  --sdCompositionHeaderFontWeights: 700;
  --sdTypography: 500 26px/1.25 Arial;
  --sdBorder: 4px solid #FFFF00;
  --sdShadowSingle: inset 0 4px 10px 0 rgba(0,0,0,0.4);
  --sdShadowDouble: inset 0 4px 10px 0 rgba(0,0,0,0.4), 0 8px 12px 5px rgba(0,0,0,0.4);`,
    );
  });

  it.only('optionally can transform typography, border and shadow tokens', async () => {
    transformOpts = {
      expand: {
        typography: true,
        border: true,
        shadow: true,
      },
    };
    before();

    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdCompositionSize: 24px;
  --sdCompositionOpacity: 50%;
  --sdCompositionFontSizes: 96px;
  --sdCompositionFontFamilies: Roboto;
  --sdCompositionFontWeights: 700;
  --sdCompositionHeaderFontFamilies: Roboto;
  --sdCompositionHeaderFontSizes: 96px;
  --sdCompositionHeaderFontWeights: 700;
  --sdTypographyFontFamilies: Arial;
  --sdTypographyFontWeights: 500;
  --sdTypographyLineHeights: 1.25;
  --sdTypographyFontSizes: 26px;
  --sdTypographyLetterSpacing: 0;
  --sdTypographyParagraphSpacing: 0;
  --sdTypographyParagraphIndent: 0;
  --sdTypographyTextDecoration: none;
  --sdTypographyTextCase: none;
  --sdBorderColor: #FFFF00;
  --sdBorderWidth: 4px;
  --sdBorderStyle: solid;
  --sdShadowSingleX: 0;
  --sdShadowSingleY: 4px;
  --sdShadowSingleBlur: 10px;
  --sdShadowSingleSpread: 0;
  --sdShadowSingleColor: rgba(0,0,0,0.4);
  --sdShadowSingleType: innerShadow;
  --sdShadowDouble1X: 0;
  --sdShadowDouble1Y: 4px;
  --sdShadowDouble1Blur: 10px;
  --sdShadowDouble1Spread: 0;
  --sdShadowDouble1Color: rgba(0,0,0,0.4);
  --sdShadowDouble1Type: innerShadow;
  --sdShadowDouble2X: 0;
  --sdShadowDouble2Y: 8px;
  --sdShadowDouble2Blur: 12px;
  --sdShadowDouble2Spread: 5px;
  --sdShadowDouble2Color: rgba(0,0,0,0.4);`,
    );
  });
});
