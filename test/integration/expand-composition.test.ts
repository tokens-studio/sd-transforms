import type StyleDictionary from 'style-dictionary';
import { describe, beforeEach, afterEach, expect, it } from 'vitest';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, excerpt, init } from './utils.js';
import { expandTypesMap } from '../../src/index.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/expand-composition.tokens.json'],
  expand: {
    typesMap: expandTypesMap,
  },
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

async function before() {
  await cleanup(dict);
  dict = await init(cfg, { withSDBuiltins: true });
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

  it('allows expanding composition tokens only', async () => {
    await cleanup(dict);
    dict = await init(
      {
        ...cfg,
        expand: {
          ...cfg.expand,
          include: ['composition'],
        },
      },
      { withSDBuiltins: true },
    );

    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      start: ':root {',
      end: '\n}',
    });
    const expectedOutput = `--sdCompositionSize: 24px;
--sdCompositionOpacity: 0.5;
--sdCompositionFontSize: 96px;
--sdCompositionFontFamily: Roboto;
--sdCompositionFontWeight: 700;
--sdTypography: italic 800 26px/1.25 Arial;
--sdFontWeightRefWeight: 800;
--sdFontWeightRefStyle: italic;
--sdBorder: 4px solid #FFFF00;
--sdShadowSingle: inset 0 4px 10px 0 rgba(0,0,0,0.4);
--sdShadowDouble: inset 0 4px 10px 0 rgba(0,0,0,0.4), 0 8px 12px 5px rgba(0,0,0,0.4);
--sdRef: italic 800 26px/1.25 Arial;
--sdDeepRef: italic 800 26px/1.25 Arial;
--sdDeepRefShadowMulti: inset 0 4px 10px 0 rgba(0,0,0,0.4), 0 8px 12px 5px rgba(0,0,0,0.4);
--sdCompositionHeaderFontFamily: Roboto;
--sdCompositionHeaderFontSize: 96px;
--sdCompositionHeaderFontWeight: 700;
--sdCompositionHeaderLineHeight: 1.25;
--sdCompositionHeaderLetterSpacing: 1.25em;`;
    expect(content).to.equal(expectedOutput);
  });

  it('optionally can transform typography, border and shadow tokens', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: ':root {', end: '--sdRefFontFamily: Arial;' });
    const expectedOutput = `--sdCompositionSize: 24px;
--sdCompositionOpacity: 0.5;
--sdCompositionFontSize: 96px;
--sdCompositionFontFamily: Roboto;
--sdCompositionFontWeight: 700;
--sdFontWeightRefWeight: 800;
--sdFontWeightRefStyle: italic;
--sdCompositionHeaderFontFamily: Roboto;
--sdCompositionHeaderFontSize: 96px;
--sdCompositionHeaderFontWeight: 700;
--sdCompositionHeaderLineHeight: 1.25;
--sdCompositionHeaderLetterSpacing: 1.25em;
--sdTypographyFontFamily: Arial;
--sdTypographyFontWeight: 800;
--sdTypographyLineHeight: 1.25;
--sdTypographyFontSize: 26px;
--sdTypographyLetterSpacing: 1.25em;
--sdTypographyParagraphSpacing: 0;
--sdTypographyParagraphIndent: 0;
--sdTypographyTextDecoration: none;
--sdTypographyTextCase: none;
--sdTypographyFontStyle: italic;
--sdBorderColor: #ffff00;
--sdBorderWidth: 4px;
--sdBorderStyle: solid;
--sdShadowSingleBlur: 10px;
--sdShadowSingleSpread: 0;
--sdShadowSingleColor: rgba(0, 0, 0, 0.4);
--sdShadowSingleType: innerShadow;
--sdShadowSingleOffsetX: 0;
--sdShadowSingleOffsetY: 4px;
--sdShadowDouble1Blur: 10px;
--sdShadowDouble1Spread: 0;
--sdShadowDouble1Color: rgba(0, 0, 0, 0.4);
--sdShadowDouble1Type: innerShadow;
--sdShadowDouble1OffsetX: 0;
--sdShadowDouble1OffsetY: 4px;
--sdShadowDouble2Blur: 12px;
--sdShadowDouble2Spread: 5px;
--sdShadowDouble2Color: rgba(0, 0, 0, 0.4);
--sdShadowDouble2OffsetX: 0;
--sdShadowDouble2OffsetY: 8px;`;
    expect(content).toBe(expectedOutput);
  });

  it('handles references and deep references for expandable values', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, {
      start: '--sdShadowDouble2OffsetY: 8px;',
      end: '--sdDeepRefShadowMulti1Blur: 10px;',
    });
    const expectedOutput = `--sdRefFontFamily: Arial;
--sdRefFontWeight: 800;
--sdRefLineHeight: 1.25;
--sdRefFontSize: 26px;
--sdRefLetterSpacing: 1.25em;
--sdRefParagraphSpacing: 0;
--sdRefParagraphIndent: 0;
--sdRefTextDecoration: none;
--sdRefTextCase: none;
--sdRefFontStyle: italic;
--sdDeepRefFontFamily: Arial;
--sdDeepRefFontWeight: 800;
--sdDeepRefLineHeight: 1.25;
--sdDeepRefFontSize: 26px;
--sdDeepRefLetterSpacing: 1.25em;
--sdDeepRefParagraphSpacing: 0;
--sdDeepRefParagraphIndent: 0;
--sdDeepRefTextDecoration: none;
--sdDeepRefTextCase: none;
--sdDeepRefFontStyle: italic;`;
    expect(content).toBe(expectedOutput);
  });

  it('handles references for multi-shadow value', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    const content = excerpt(file, { start: '--sdDeepRefFontStyle: italic;', end: '}' });
    const expectedOutput = `--sdDeepRefShadowMulti1Blur: 10px;
--sdDeepRefShadowMulti1Spread: 0;
--sdDeepRefShadowMulti1Color: rgba(0, 0, 0, 0.4);
--sdDeepRefShadowMulti1Type: innerShadow;
--sdDeepRefShadowMulti1OffsetX: 0;
--sdDeepRefShadowMulti1OffsetY: 4px;
--sdDeepRefShadowMulti2Blur: 12px;
--sdDeepRefShadowMulti2Spread: 5px;
--sdDeepRefShadowMulti2Color: rgba(0, 0, 0, 0.4);
--sdDeepRefShadowMulti2OffsetX: 0;
--sdDeepRefShadowMulti2OffsetY: 8px;`;
    expect(content).toBe(expectedOutput);
  });
});
