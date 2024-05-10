import StyleDictionary from 'style-dictionary';
import { expect } from '@esm-bundle/chai';
import Color from 'tinycolor2';
import { promises } from 'node:fs';
import path from 'node:path';
import { cleanup, init } from './utils.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

StyleDictionary.registerTransform({
  name: 'transitive/color/UIColorSwift',
  type: 'value',
  transitive: true,
  transform: token => {
    const { r, g, b, a } = Color(token.value).toRgb();
    const rFixed = (r / 255.0).toFixed(3);
    const gFixed = (g / 255.0).toFixed(3);
    const bFixed = (b / 255.0).toFixed(3);
    return `UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})`;
  },
});

const cfg = {
  source: ['test/integration/tokens/swift-UI-colors.tokens.json'],
  platforms: {
    css: {
      transforms: [
        'ts/color/modifiers',
        'attribute/cti',
        'transitive/color/UIColorSwift',
        'name/camel',
      ],
      buildPath: outputDir,
      files: [
        {
          destination: outputFileName,
          format: 'ios-swift/class.swift',
        },
      ],
    },
  },
};

let dict: StyleDictionary | undefined;

describe('outputReferences integration', () => {
  beforeEach(async () => {
    if (dict) {
      cleanup(dict);
    }
    dict = await init(cfg, { 'ts/color/modifiers': { format: 'hex' } });
  });

  afterEach(() => {
    if (dict) {
      cleanup(dict);
    }
  });

  it('supports UIColor with color modifiers', async () => {
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to
      .include(`    public static let colorDanger = UIColor(red: 0.251, green: 0.000, blue: 0.000, alpha: 1)
    public static let colorError = UIColor(red: 0.125, green: 0.000, blue: 0.000, alpha: 1)
    public static let colorRed = UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)`);
  });
});
