import type StyleDictionary from 'style-dictionary';
import { expect } from '@esm-bundle/chai';
import { promises } from 'node:fs';
import path from 'node:path';
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
let dict: StyleDictionary | undefined;

async function before() {
  await cleanup(dict);
  dict = await init(cfg, transformOpts);
}

async function after() {
  await cleanup(dict);
}

describe('expand composition tokens', () => {
  beforeEach(async () => {
    await before();
  });

  afterEach(async () => {
    await after();
  });

  it('only expands composition tokens by default', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');

    expect(file).to.include(
      `
  --sdCompositionSize: 24px;
  --sdCompositionOpacity: 0.5;
  --sdCompositionFontSize: 96px;
  --sdCompositionFontFamily: Roboto;
  --sdCompositionFontWeight: 700;
  --sdCompositionHeaderFontFamilies: Roboto;
  --sdCompositionHeaderFontSizes: 96px;
  --sdCompositionHeaderFontWeights: 700;
  --sdTypography: 800 italic 26px/1.25 Arial;
  --sdFontWeightRef: 800 italic;
  --sdBorder: 4px solid #FFFF00;
  --sdShadowSingle: inset 0 4px 10px 0 rgba(0,0,0,0.4);
  --sdShadowDouble: inset 0 4px 10px 0 rgba(0,0,0,0.4), 0 8px 12px 5px rgba(0,0,0,0.4);
  --sdRef: 800 italic 26px/1.25 Arial;`,
    );
  });

  it('optionally can transform typography, border and shadow tokens', async () => {
    transformOpts = {
      expand: {
        typography: true,
        border: true,
        shadow: true,
      },
    };
    await before();

    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdCompositionSize: 24px;
  --sdCompositionOpacity: 0.5;
  --sdCompositionFontSize: 96px;
  --sdCompositionFontFamily: Roboto;
  --sdCompositionFontWeight: 700;
  --sdCompositionHeaderFontFamilies: Roboto;
  --sdCompositionHeaderFontSizes: 96px;
  --sdCompositionHeaderFontWeights: 700;
  --sdTypographyFontFamily: Arial;
  --sdTypographyFontWeight: 800;
  --sdTypographyLineHeight: 1.25;
  --sdTypographyFontSize: 26px;
  --sdTypographyLetterSpacing: 0;
  --sdTypographyParagraphSpacing: 0;
  --sdTypographyParagraphIndent: 0;
  --sdTypographyTextDecoration: none;
  --sdTypographyTextCase: none;
  --sdTypographyFontStyle: italic;
  --sdFontWeightRef: 800 italic;
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

  it('handles references and deep references for expandable values', async () => {
    transformOpts = {
      expand: {
        typography: true,
      },
    };
    await before();

    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdRefFontFamily: Arial;
  --sdRefFontWeight: 800;
  --sdRefLineHeight: 1.25;
  --sdRefFontSize: 26px;
  --sdRefLetterSpacing: 0;
  --sdRefParagraphSpacing: 0;
  --sdRefParagraphIndent: 0;
  --sdRefTextDecoration: none;
  --sdRefTextCase: none;
  --sdRefFontStyle: italic;
  --sdDeepRefFontFamily: Arial;
  --sdDeepRefFontWeight: 800;
  --sdDeepRefLineHeight: 1.25;
  --sdDeepRefFontSize: 26px;
  --sdDeepRefLetterSpacing: 0;
  --sdDeepRefParagraphSpacing: 0;
  --sdDeepRefParagraphIndent: 0;
  --sdDeepRefTextDecoration: none;
  --sdDeepRefTextCase: none;
  --sdDeepRefFontStyle: italic;`,
    );
  });

  it('handles references for multi-shadow value', async () => {
    transformOpts = {
      expand: {
        shadow: true,
      },
    };
    await before();

    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(
      `
  --sdDeepRefShadowMulti1X: 0;
  --sdDeepRefShadowMulti1Y: 4px;
  --sdDeepRefShadowMulti1Blur: 10px;
  --sdDeepRefShadowMulti1Spread: 0;
  --sdDeepRefShadowMulti1Color: rgba(0,0,0,0.4);
  --sdDeepRefShadowMulti1Type: innerShadow;
  --sdDeepRefShadowMulti2X: 0;
  --sdDeepRefShadowMulti2Y: 8px;
  --sdDeepRefShadowMulti2Blur: 12px;
  --sdDeepRefShadowMulti2Spread: 5px;
  --sdDeepRefShadowMulti2Color: rgba(0,0,0,0.4)`,
    );
  });
});
