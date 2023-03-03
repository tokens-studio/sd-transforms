// @ts-nocheck
var dist = {};

var ast = {};

var errors = {};

Object.defineProperty(errors, "__esModule", { value: true });
class ParseError extends SyntaxError {
    static fromCode(code, offset) {
        return new ParseError(MESSAGES[code], code, offset);
    }
    constructor(message, code, offset) {
        super(message);
        this.code = code;
        this.index = offset;
    }
}
errors.ParseError = ParseError;
const MESSAGES = {
    "eof-in-string": "Unclosed string",
    "eof-in-comment": "Unclosed comment",
    "eof-in-bracket": "Unclosed bracket",
    "unexpected-parenthesis": "Unexpected token",
    "unexpected-calc-token": "Unexpected token",
};

(function (exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(errors);
} (ast));

var cssCalc = {};

var parser = {};

var nodeImpl = {};

var stringifier = {};

Object.defineProperty(stringifier, "__esModule", { value: true });
function rawVal(node, name) {
    const r = node.raws[name];
    return r ? r.raw : `${node[name]}`;
}
function raw(node, name) {
    const r = node.raws[name];
    return r || "";
}
function wrapRaws(node, inner) {
    return `${raw(node, "before")}${inner}`;
}
function numWithUnit(node) {
    return wrapRaws(node, `${rawVal(node, "value")}${rawVal(node, "unit")}`);
}
let Stringifier$1 = class Stringifier {
    constructor(options) {
        this.options = Object.assign({
            autofix: false,
        }, options || {});
    }
    stringify(node) {
        return this[node.type](node);
    }
    Root(node) {
        let s = "";
        for (const c of node.nodes) {
            s += this.stringify(c);
        }
        s += raw(node, "after");
        return s;
    }
    Function(node) {
        let s = `${node.name}(`;
        for (const c of node.nodes) {
            s += this.stringify(c);
        }
        s += raw(node, "beforeClose");
        if (this.options.autofix || !node.unclosed) {
            s += ")";
        }
        return wrapRaws(node, s);
    }
    Parentheses(node) {
        let s = "(";
        for (const c of node.nodes) {
            s += this.stringify(c);
        }
        s += raw(node, "beforeClose");
        if (this.options.autofix || !node.unclosed) {
            s += ")";
        }
        return wrapRaws(node, s);
    }
    MathExpression(node) {
        let beforeLeft = "";
        let between = raw(node, "between");
        let beforeRight = "";
        let afterRight = "";
        if (this.options.autofix) {
            if (!between) {
                between = " ";
            }
            if (!node.right.raws.before) {
                beforeRight = " ";
            }
            if (node.left.type === "MathExpression") {
                if ((node.left.operator === "+" ||
                    node.left.operator === "-") &&
                    (node.operator === "*" || node.operator === "/")) {
                    beforeLeft += "(";
                    between = `)${between}`;
                }
            }
            if (node.right.type === "MathExpression") {
                if ((node.operator === "+" && node.right.operator === "-") ||
                    ((node.operator === "-" || node.operator === "*") &&
                        (node.right.operator === "+" ||
                            node.right.operator === "-")) ||
                    node.operator === "/") {
                    beforeRight += "(";
                    afterRight = `)${afterRight}`;
                }
            }
        }
        return wrapRaws(node, `${beforeLeft}${this.stringify(node.left)}${between}${node.operator}${beforeRight}${this.stringify(node.right)}${afterRight}`);
    }
    Number(node) {
        return wrapRaws(node, rawVal(node, "value"));
    }
    Punctuator(node) {
        return wrapRaws(node, node.value);
    }
    Word(node) {
        return wrapRaws(node, node.value);
    }
    String(node) {
        return wrapRaws(node, node.value);
    }
    Operator(node) {
        return wrapRaws(node, node.value);
    }
    Length(node) {
        return numWithUnit(node);
    }
    Angle(node) {
        return numWithUnit(node);
    }
    Time(node) {
        return numWithUnit(node);
    }
    Frequency(node) {
        return numWithUnit(node);
    }
    Resolution(node) {
        return numWithUnit(node);
    }
    Percentage(node) {
        return numWithUnit(node);
    }
    Flex(node) {
        return numWithUnit(node);
    }
    word(node) {
        return node.value;
    }
    punctuator(node) {
        return node.value;
    }
    operator(node) {
        return node.value;
    }
    whitespace(node) {
        return node.value;
    }
    comment(node) {
        return node.value;
    }
    string(node) {
        return node.value;
    }
    "inline-comment"(node) {
        return node.value;
    }
};
stringifier.Stringifier = Stringifier$1;

Object.defineProperty(nodeImpl, "__esModule", { value: true });
const stringifier_1$1 = stringifier;
let defaultStringifier = null;
class Node {
    constructor() {
        this.parent = null;
    }
    toString(stringifier) {
        if (typeof stringifier === "function") {
            return stringifier(this);
        }
        return (stringifier ||
            defaultStringifier ||
            (defaultStringifier = new stringifier_1$1.Stringifier())).stringify(this);
    }
    walk(type, callback) {
        const node = this;
        let result = undefined;
        const nodes = [...(node.nodes || []), node.left, node.right].filter(n => Boolean(n));
        const check = typeof type === "string"
            ? (n) => n.type === type
            : (n) => type.test(n.type);
        for (const child of nodes) {
            if (check(child)) {
                result = callback(child);
                if (result === false) {
                    break;
                }
            }
            if (child.walk) {
                result = child.walk(type, callback);
                if (result === false) {
                    break;
                }
            }
        }
        return result;
    }
}
class Container extends Node {
    push(...children) {
        for (const child of children) {
            if (child.type === "Root") {
                this.push(...child.nodes);
            }
            else {
                child.parent = this;
                this.nodes.push(child);
            }
        }
        return this;
    }
    unshift(...children) {
        for (const child of children.reverse()) {
            if (child.type === "Root") {
                this.unshift(...child.nodes);
            }
            else {
                child.parent = this;
                this.nodes.unshift(child);
            }
        }
        return this;
    }
    append(...children) {
        return this.push(...children);
    }
    prepend(...children) {
        return this.unshift(...children);
    }
    insertBefore(exist, add) {
        if (add.type === "Root") {
            const { nodes } = add;
            if (nodes.length === 1) {
                return this.insertBefore(exist, nodes[0]);
            }
            throw new Error("The given Root node is illegal.");
        }
        const existIndex = this.nodes.indexOf(exist);
        if (existIndex < 0) {
            throw new Error("The given node could not be found.");
        }
        add.parent = this;
        this.nodes.splice(existIndex, 0, add);
        return this;
    }
    insertAfter(exist, add) {
        if (add.type === "Root") {
            const { nodes } = add;
            if (nodes.length === 1) {
                return this.insertAfter(exist, nodes[0]);
            }
            throw new Error("The given Root node is illegal.");
        }
        const existIndex = this.nodes.indexOf(exist);
        if (existIndex < 0) {
            throw new Error("The given node could not be found.");
        }
        add.parent = this;
        this.nodes.splice(existIndex + 1, 0, add);
        return this;
    }
    removeAll() {
        for (const node of this.nodes) {
            node.parent = null;
        }
        this.nodes = [];
        return this;
    }
    removeChild(child) {
        const index = this.nodes.indexOf(child);
        this.nodes[index].parent = null;
        this.nodes.splice(index, 1);
        return this;
    }
    get first() {
        return this.nodes[0] || null;
    }
    get last() {
        return this.nodes[this.nodes.length - 1] || null;
    }
}
class NumberValue extends Node {
    constructor(value, before, source) {
        super();
        const num = parseFloat(value);
        this.type = "Number";
        this.value = num;
        this.raws = {
            before,
            value: {
                raw: value,
                value: num,
            },
        };
        this.source = source;
    }
}
nodeImpl.NumberValue = NumberValue;
class NumWithUnitValue extends Node {
    constructor(type, value, unit, before, source) {
        super();
        const num = parseFloat(value);
        this.type = type;
        this.value = num;
        this.unit = unit;
        this.raws = {
            before,
            value: {
                raw: value,
                value: num,
            },
        };
        this.source = source;
    }
}
class LengthValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Length", value, unit, before, source);
    }
}
nodeImpl.LengthValue = LengthValue;
class AngleValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Angle", value, unit, before, source);
    }
}
nodeImpl.AngleValue = AngleValue;
class TimeValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Time", value, unit, before, source);
    }
}
nodeImpl.TimeValue = TimeValue;
class FrequencyValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Frequency", value, unit, before, source);
    }
}
nodeImpl.FrequencyValue = FrequencyValue;
class ResolutionValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Resolution", value, unit, before, source);
    }
}
nodeImpl.ResolutionValue = ResolutionValue;
class PercentageValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Percentage", value, unit, before, source);
    }
}
nodeImpl.PercentageValue = PercentageValue;
class FlexValue extends NumWithUnitValue {
    constructor(value, unit, before, source) {
        super("Flex", value, unit, before, source);
    }
}
nodeImpl.FlexValue = FlexValue;
class TokenValue extends Node {
    constructor(type, value, before, source) {
        super();
        this.type = type;
        this.value = value;
        this.raws = {
            before,
        };
        this.source = source;
    }
}
class Word extends TokenValue {
    constructor(value, before, source) {
        super("Word", value, before, source);
    }
}
nodeImpl.Word = Word;
class StringNode extends TokenValue {
    constructor(value, before, source) {
        super("String", value, before, source);
    }
}
nodeImpl.StringNode = StringNode;
function defineAssessor(obj, name, setterProc) {
    const localName = Symbol(`${name}`);
    Object.defineProperties(obj, {
        [localName]: { writable: true, enumerable: false },
        [name]: {
            get() {
                return this[localName];
            },
            set(n) {
                const o = this[localName];
                this[localName] = setterProc(n, o);
            },
            enumerable: true,
        },
    });
}
class MathExpression extends Node {
    constructor(left, operator, right, before, source) {
        super();
        const ope = operator.value;
        const between = operator.raws.before;
        this.type = "MathExpression";
        const setterProc = (n, o) => {
            let e;
            if (n.type === "Root") {
                const { nodes } = n;
                if (nodes.length === 1) {
                    e = nodes[0];
                }
                else {
                    throw new Error("The given Root node is illegal.");
                }
            }
            else {
                e = n;
            }
            e.parent = this;
            if (o) {
                o.parent = null;
            }
            return e;
        };
        defineAssessor(this, "left", setterProc);
        this.left = left;
        this.operator = ope;
        defineAssessor(this, "right", setterProc);
        this.right = right;
        this.raws = { before, between };
        this.source = source;
    }
}
nodeImpl.MathExpression = MathExpression;
class FunctionNode extends Container {
    constructor(name, before, source) {
        super();
        this.type = "Function";
        this.name = name;
        this.nodes = [];
        this.raws = { before };
        this.source = source;
    }
}
nodeImpl.FunctionNode = FunctionNode;
class Parentheses extends Container {
    constructor(before, source) {
        super();
        this.type = "Parentheses";
        this.nodes = [];
        this.raws = { before };
        this.source = source;
    }
}
nodeImpl.Parentheses = Parentheses;
class Punctuator extends TokenValue {
    constructor(value, before, source) {
        super("Punctuator", value, before, source);
    }
}
nodeImpl.Punctuator = Punctuator;
class Root extends Container {
    constructor(source) {
        super();
        this.type = "Root";
        this.nodes = [];
        this.tokens = [];
        this.errors = [];
        this.raws = { after: "" };
        this.source = source;
    }
}
nodeImpl.Root = Root;
class Operator extends TokenValue {
    constructor(value, before, source) {
        super("Operator", value, before, source);
    }
}
nodeImpl.Operator = Operator;

var factory = {};

var minus = "-".charCodeAt(0);
var plus = "+".charCodeAt(0);
var dot = ".".charCodeAt(0);
var exp = "e".charCodeAt(0);
var EXP = "E".charCodeAt(0);

var unit = function(value) {
  var pos = 0;
  var length = value.length;
  var dotted = false;
  var sciPos = -1;
  var containsNumber = false;
  var code;

  while (pos < length) {
    code = value.charCodeAt(pos);

    if (code >= 48 && code <= 57) {
      containsNumber = true;
    } else if (code === exp || code === EXP) {
      if (sciPos > -1) {
        break;
      }
      sciPos = pos;
    } else if (code === dot) {
      if (dotted) {
        break;
      }
      dotted = true;
    } else if (code === plus || code === minus) {
      if (pos !== 0) {
        break;
      }
    } else {
      break;
    }

    pos += 1;
  }

  if (sciPos + 1 === pos) pos--;

  return containsNumber
    ? {
        number: value.slice(0, pos),
        unit: value.slice(pos)
      }
    : false;
};

Object.defineProperty(factory, "__esModule", { value: true });
const valueParserUnit = unit;
const Impl$1 = nodeImpl;
const LENGTH_UNITS = [
    "em",
    "ex",
    "ch",
    "rem",
    "vw",
    "vh",
    "vmin",
    "vmax",
    "px",
    "mm",
    "cm",
    "in",
    "pt",
    "pc",
    "Q",
    "vm",
];
const ANGLE_UNITS = ["deg", "grad", "turn", "rad"];
const TIME_UNITS = ["s", "ms"];
const FREQUENCY_UNITS = ["Hz", "kHz"];
const RESOLUTION_UNITS = ["dpi", "dpcm", "dppm"];
const FLEX_UNITS = ["fr"];
const L_LENGTH_UNITS = LENGTH_UNITS.map(u => u.toLowerCase());
const L_ANGLE_UNITS = ANGLE_UNITS.map(u => u.toLowerCase());
const L_TIME_UNITS = TIME_UNITS.map(u => u.toLowerCase());
const L_FREQUENCY_UNITS = FREQUENCY_UNITS.map(u => u.toLowerCase());
const L_RESOLUTION_UNITS = RESOLUTION_UNITS.map(u => u.toLowerCase());
const L_FLEX_UNITS = FLEX_UNITS.map(u => u.toLowerCase());
function newPunctuator(token, before) {
    if (token.value === "," || token.value === ")") {
        return newTokenNode(Impl$1.Punctuator, token, token.value, before);
    }
    throw new Error(`illegal argument error "${token.value}"`);
}
factory.newPunctuator = newPunctuator;
function newOperator(token, before) {
    return newTokenNode(Impl$1.Operator, token, token.value, before);
}
factory.newOperator = newOperator;
function newString(token, before) {
    return newTokenNode(Impl$1.StringNode, token, token.value, before);
}
factory.newString = newString;
function newWordNode(token, before) {
    return newValueNode(token, before);
}
factory.newWordNode = newWordNode;
function newFunction(token, before, open) {
    return new Impl$1.FunctionNode(token.value, before, {
        start: token.source.start,
        end: open.source.end,
    });
}
factory.newFunction = newFunction;
function newParentheses(token, before) {
    return new Impl$1.Parentheses(before, {
        start: token.source.start,
        end: token.source.end,
    });
}
factory.newParentheses = newParentheses;
function newMathExpression(left, op, right) {
    const opNode = typeof op === "string"
        ? newTokenNode(Impl$1.Operator, { source: { start: { index: 0 }, end: { index: 0 } } }, op, " ")
        : op;
    const { before } = left.raws;
    left.raws.before = "";
    return new Impl$1.MathExpression(left, opNode, right, before, {
        start: left.source.start,
        operator: opNode.source,
        end: right.source.end,
    });
}
factory.newMathExpression = newMathExpression;
function newValueNode(token, before) {
    if (token.type === "word") {
        const parsedUnit = valueParserUnit(token.value);
        if (parsedUnit) {
            const n = newNumNode(parsedUnit, token, before);
            if (n) {
                return n;
            }
        }
    }
    return newTokenNode(Impl$1.Word, token, token.value, before);
}
function newNumNode(parsedUnit, token, before) {
    const { source } = token;
    if (!parsedUnit.unit) {
        return new Impl$1.NumberValue(parsedUnit.number, before, source);
    }
    const lunit = parsedUnit.unit.toLowerCase();
    function unitNode(WithUnitValue, unit) {
        const n = new WithUnitValue(parsedUnit.number, unit, before, source);
        if (unit !== parsedUnit.unit) {
            n.raws.unit = {
                raw: parsedUnit.unit,
                value: unit,
            };
        }
        return n;
    }
    let unitIndex;
    if ((unitIndex = L_LENGTH_UNITS.indexOf(lunit)) >= 0) {
        return unitNode(Impl$1.LengthValue, LENGTH_UNITS[unitIndex]);
    }
    if ((unitIndex = L_ANGLE_UNITS.indexOf(lunit)) >= 0) {
        return unitNode(Impl$1.AngleValue, ANGLE_UNITS[unitIndex]);
    }
    if ((unitIndex = L_TIME_UNITS.indexOf(lunit)) >= 0) {
        return unitNode(Impl$1.TimeValue, TIME_UNITS[unitIndex]);
    }
    if ((unitIndex = L_FREQUENCY_UNITS.indexOf(lunit)) >= 0) {
        return unitNode(Impl$1.FrequencyValue, FREQUENCY_UNITS[unitIndex]);
    }
    if ((unitIndex = L_RESOLUTION_UNITS.indexOf(lunit)) >= 0) {
        return unitNode(Impl$1.ResolutionValue, RESOLUTION_UNITS[unitIndex]);
    }
    if ((unitIndex = L_FLEX_UNITS.indexOf(lunit)) >= 0) {
        return unitNode(Impl$1.FlexValue, FLEX_UNITS[unitIndex]);
    }
    if (lunit === "%") {
        return unitNode(Impl$1.PercentageValue, "%");
    }
    return null;
}
function newTokenNode(TokenValue, token, value, before) {
    const { source } = token;
    return new TokenValue(value, before, source);
}

var calcNotation = {};

Object.defineProperty(calcNotation, "__esModule", { value: true });
const RE_CALC = /^(-(webkit|mox)-)?calc/iu;
const RE_MIN = /^(-(webkit|mox)-)?min/iu;
const RE_MAX = /^(-(webkit|mox)-)?max/iu;
const RE_CLAMP = /^(-(webkit|mox)-)?clamp/iu;
function isCalc(name) {
    return RE_CALC.test(name);
}
calcNotation.isCalc = isCalc;
function isMin(name) {
    return RE_MIN.test(name);
}
calcNotation.isMin = isMin;
function isMax(name) {
    return RE_MAX.test(name);
}
calcNotation.isMax = isMax;
function isClamp(name) {
    return RE_CLAMP.test(name);
}
calcNotation.isClamp = isClamp;
function isMathFunction(name) {
    return isCalc(name) || isClamp(name) || isMin(name) || isMax(name);
}
calcNotation.isMathFunction = isMathFunction;

var utils = {};

Object.defineProperty(utils, "__esModule", { value: true });
function isComma(node) {
    return node.type === "Punctuator" && node.value === ",";
}
utils.isComma = isComma;
function getFunctionArguments(fn) {
    const { nodes } = fn;
    const first = nodes[0];
    if (!first || isComma(first)) {
        return null;
    }
    const result = [first];
    const length = nodes.length;
    for (let index = 1; index < length; index++) {
        const comma = nodes[index++];
        if (!isComma(comma)) {
            return null;
        }
        const arg = nodes[index];
        if (!arg || isComma(arg)) {
            return null;
        }
        result.push(arg);
    }
    return result;
}
utils.getFunctionArguments = getFunctionArguments;

Object.defineProperty(parser, "__esModule", { value: true });
const AST$2 = ast;
const Impl = nodeImpl;
const factory_1$1 = factory;
const calc_notation_1$2 = calcNotation;
const utils_1$2 = utils;
const MAYBE_FUNCTION = /^([^-+0-9.]|-[^+0-9.])/u;
const PRECEDENCE = {
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
};
function srcLoc(node) {
    return node.source || { start: { index: 0 }, end: { index: 0 } };
}
function isExpression(node) {
    if (node && node.type !== "Punctuator" && node.type !== "Operator") {
        return node;
    }
    return null;
}
let Parser$1 = class Parser {
    constructor(tokenizer, _options) {
        this.tokenizer = tokenizer;
        this.root = new Impl.Root({
            start: {
                index: 0,
            },
            end: {
                index: 0,
            },
        });
        this.rescans = [];
        this.tokens = this.root.tokens;
        this.errors = this.root.errors;
    }
    parse() {
        let state = {
            container: this.root,
            fnName: "",
            post() {
            },
            eof() {
            },
        };
        while (state) {
            state = this.processExpressions(state);
        }
        const { tokens } = this;
        if (tokens.length > 0) {
            srcLoc(this.root).end.index =
                tokens[tokens.length - 1].source.end.index;
        }
        this.errors.unshift(...this.tokenizer.errors);
        this.errors.sort((e1, e2) => e1.index - e2.index);
        return this.root;
    }
    reportParseError(code, index = 0) {
        if (this.errors.find(e => e.code === code && e.index === index)) {
            return;
        }
        const error = AST$2.ParseError.fromCode(code, index);
        this.errors.push(error);
    }
    processExpressions(state) {
        let tokenSet;
        while ((tokenSet = this.scan())) {
            const { token } = tokenSet;
            switch (token.type) {
                case "word":
                    if (MAYBE_FUNCTION.test(token.value)) {
                        const next = this.scan();
                        if (next) {
                            if (!next.raws &&
                                next.token.type === "punctuator" &&
                                next.token.value === "(") {
                                return this.processFunction(token, tokenSet.raws, next.token, state);
                            }
                            this.back(next);
                        }
                    }
                    state.container.push(factory_1$1.newWordNode(token, tokenSet.raws));
                    break;
                case "string":
                    state.container.push(factory_1$1.newString(token, tokenSet.raws));
                    break;
                case "operator":
                    this.checkAndMergeMathExpr(state, PRECEDENCE[token.value]);
                    state.container.push(factory_1$1.newOperator(token, tokenSet.raws));
                    break;
                case "punctuator":
                    this.checkAndMergeMathExpr(state);
                    return this.processPunctuator(token, tokenSet.raws, state);
            }
        }
        this.postStack(state);
        state.eof();
        return null;
    }
    checkAndMergeMathExpr(state, currPrecedence) {
        const { container } = state;
        const { nodes } = container;
        if (nodes.length >= 3) {
            const bfOp = nodes[nodes.length - 2];
            if (bfOp.type === "Operator" && PRECEDENCE[bfOp.value]) {
                if (currPrecedence == null ||
                    currPrecedence <= PRECEDENCE[bfOp.value]) {
                    const math = this.mergeMathExpr(state);
                    if (math) {
                        container.push(math);
                    }
                }
            }
        }
    }
    processPunctuator(token, before, state) {
        const { container, parent } = state;
        if (token.value === "(") {
            const node = factory_1$1.newParentheses(token, before);
            container.push(node);
            return this.createNestedStateContainer(node, state.fnName, state);
        }
        this.postStack(state);
        if (token.value === ")") {
            if (parent) {
                state.post(token, before);
                return parent;
            }
            this.reportParseError("unexpected-parenthesis", token.source.start.index);
        }
        container.push(factory_1$1.newPunctuator(token, before));
        return state;
    }
    processFunction(token, before, open, state) {
        const node = factory_1$1.newFunction(token, before, open);
        state.container.push(node);
        return this.createNestedStateContainer(node, node.name, state);
    }
    createNestedStateContainer(node, fnName, state) {
        return {
            container: node,
            parent: state,
            fnName,
            post(close, beforeClose) {
                if (beforeClose) {
                    node.raws.beforeClose = beforeClose;
                }
                srcLoc(node).end = close.source.end;
            },
            eof: () => {
                node.unclosed = true;
                const last = this.tokens[this.tokens.length - 1];
                const lastChild = node.last;
                if (lastChild) {
                    srcLoc(node).end = srcLoc(lastChild).end;
                }
                this.reportParseError("eof-in-bracket", last.source.end.index);
                state.eof();
            },
        };
    }
    mergeMathExpr(state) {
        const { container: { nodes }, } = state;
        const right = nodes.pop();
        const op = nodes.pop();
        const left = nodes.pop() || null;
        const restore = () => {
            if (left) {
                nodes.push(left);
            }
            nodes.push(op, right);
        };
        const reportError = (node) => {
            if (calc_notation_1$2.isMathFunction(state.fnName)) {
                this.reportParseError("unexpected-calc-token", srcLoc(node).start.index);
            }
        };
        const rightExpr = isExpression(right);
        if (utils_1$2.isComma(op)) {
            if (!rightExpr) {
                reportError(right);
            }
            restore();
            return null;
        }
        if (!left) {
            reportError(isExpression(op) ? right : op);
            restore();
            return null;
        }
        const leftExpr = isExpression(left);
        if (!leftExpr) {
            reportError(isExpression(nodes[nodes.length - 1]) ? op : left);
            restore();
            return null;
        }
        if (op.type !== "Operator") {
            reportError(op);
            restore();
            return null;
        }
        if (!rightExpr) {
            reportError(right);
            restore();
            return null;
        }
        return factory_1$1.newMathExpression(leftExpr, op, rightExpr);
    }
    postStack(state) {
        const { container } = state;
        const { nodes } = container;
        while (nodes.length > 1) {
            const math = this.mergeMathExpr(state);
            if (math) {
                container.push(math);
            }
            else {
                return;
            }
        }
    }
    scan() {
        const re = this.rescans.shift();
        if (re) {
            return re;
        }
        let raws = "";
        let token = this.tokenizer.nextToken();
        while (token) {
            this.tokens.push(token);
            if (token.type === "whitespace" ||
                token.type === "comment" ||
                token.type === "inline-comment") {
                raws += token.value;
            }
            else {
                return {
                    token,
                    raws,
                };
            }
            token = this.tokenizer.nextToken();
        }
        if (raws) {
            this.root.raws.after = raws;
        }
        return null;
    }
    back(tokenset) {
        this.rescans.unshift(tokenset);
    }
};
parser.Parser = Parser$1;

var tokenizer = {};

var unicode = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EOF = -1;
	exports.NULL = 0x00;
	exports.TAB = 0x09;
	exports.CR = 0x0d;
	exports.LF = 0x0a;
	exports.FF = 0x0c;
	exports.SPACE = 0x20;
	exports.DQUOTE = 0x22;
	exports.SQUOTE = 0x27;
	exports.LPAREN = 0x28;
	exports.RPAREN = 0x29;
	exports.STAR = 0x2a;
	exports.PLUS = 0x2b;
	exports.COMMA = 0x2c;
	exports.MINUS = 0x2d;
	exports.DOT = 0x2e;
	exports.SLASH = 0x2f;
	exports.LBRACKET = 0x5b;
	exports.BACKSLASH = 0x5c;
	exports.RBRACKET = 0x5d;
	exports.LBRACE = 0x7b;
	exports.RBRACE = 0x7d;
	function isWhitespace(cc) {
	    return cc === exports.TAB || cc === exports.LF || cc === exports.FF || cc === exports.CR || cc === exports.SPACE;
	}
	exports.isWhitespace = isWhitespace;
	function isDigit(cc) {
	    return cc >= 0x30 && cc <= 0x39;
	}
	exports.isDigit = isDigit;
	function isLetter(cc) {
	    return ((cc >= 0x61 && cc <= 0x7a) ||
	        (cc >= 0x41 && cc <= 0x5a));
	}
	exports.isLetter = isLetter;
} (unicode));

Object.defineProperty(tokenizer, "__esModule", { value: true });
const AST$1 = ast;
const unicode_1 = unicode;
function isPunctuator(cc) {
    return cc === unicode_1.LPAREN || cc === unicode_1.RPAREN || cc === unicode_1.COMMA;
}
function maybeNumber(cc) {
    return unicode_1.isDigit(cc) || cc === unicode_1.DOT;
}
function isQuotes(cc) {
    return cc === unicode_1.DQUOTE || cc === unicode_1.SQUOTE;
}
function getRightBracket(cc) {
    if (cc === unicode_1.LPAREN) {
        return unicode_1.RPAREN;
    }
    if (cc === unicode_1.LBRACE) {
        return unicode_1.RBRACE;
    }
    return unicode_1.RBRACKET;
}
let Tokenizer$1 = class Tokenizer {
    constructor(text, options) {
        this.lastCode = unicode_1.NULL;
        this.rescan = false;
        this.token = null;
        this.lastTokenType = null;
        this.errors = [];
        this.text = text;
        this.offset = -1;
        this.state = "SCAN";
        this.nextTokenOffset = 0;
        this.options = Object.assign({
            allowInlineCommnets: true,
        }, options || {});
    }
    nextToken() {
        while (this.token == null) {
            const cc = this.scan();
            this.state = this[this.state](cc) || "SCAN";
            if (cc === unicode_1.EOF && !this.rescan) {
                break;
            }
        }
        const { token } = this;
        this.token = null;
        return token;
    }
    scan() {
        if (this.rescan) {
            this.rescan = false;
            return this.lastCode;
        }
        return this.next();
    }
    next() {
        if (this.offset < this.text.length) {
            this.offset++;
        }
        if (this.offset >= this.text.length) {
            return (this.lastCode = unicode_1.EOF);
        }
        return (this.lastCode = this.text.charCodeAt(this.offset));
    }
    back() {
        this.rescan = true;
    }
    reportParseError(code) {
        const error = AST$1.ParseError.fromCode(code, this.offset);
        this.errors.push(error);
    }
    getCode(indexOffset = 0) {
        return this.text.charCodeAt(this.nextTokenOffset + indexOffset);
    }
    commitToken(type, indexOffset = 0) {
        const start = this.nextTokenOffset;
        const offset = this.offset + indexOffset + 1;
        const value = this.text.slice(start, offset);
        this.token = {
            type,
            value,
            source: {
                start: {
                    index: start,
                },
                end: {
                    index: offset,
                },
            },
        };
        this.nextTokenOffset = offset;
        this.lastTokenType = type;
    }
    SCAN(cc) {
        if (unicode_1.isWhitespace(cc)) {
            return "WHITESPACE";
        }
        if (cc === unicode_1.DQUOTE) {
            return "DQUOTE";
        }
        if (cc === unicode_1.SQUOTE) {
            return "SQUOTE";
        }
        if (cc === unicode_1.SLASH) {
            return "SLASH";
        }
        if (cc === unicode_1.MINUS) {
            return "MINUS";
        }
        if (cc === unicode_1.PLUS) {
            return "PLUS";
        }
        if (cc === unicode_1.STAR) {
            this.commitToken("operator");
            return "SCAN";
        }
        if (isPunctuator(cc)) {
            this.commitToken("punctuator");
            return "SCAN";
        }
        if (cc === unicode_1.LBRACKET) {
            return "LBRACKET";
        }
        if (cc === unicode_1.LBRACE) {
            return "LBRACE";
        }
        if (cc === unicode_1.EOF) {
            return "SCAN";
        }
        return "WORD";
    }
    WORD(cc) {
        while (!unicode_1.isWhitespace(cc) &&
            !isPunctuator(cc) &&
            cc !== unicode_1.PLUS &&
            cc !== unicode_1.STAR &&
            cc !== unicode_1.SLASH &&
            !isQuotes(cc) &&
            cc !== unicode_1.EOF) {
            if (cc === unicode_1.MINUS) {
                const st = this.getCode();
                if (maybeNumber(st) ||
                    ((st === unicode_1.MINUS || st === unicode_1.PLUS) &&
                        maybeNumber(this.getCode(1)))) {
                    this.commitToken("word", -1);
                    return "MINUS";
                }
            }
            else if (cc === unicode_1.LBRACE || cc === unicode_1.LBRACKET || cc === unicode_1.LPAREN) {
                this.skipBrakets(this.next(), getRightBracket(cc));
            }
            cc = this.next();
        }
        this.commitToken("word", -1);
        this.back();
    }
    LBRACKET(cc) {
        this.skipBrakets(cc, unicode_1.RBRACKET);
        return "WORD";
    }
    LBRACE(cc) {
        this.skipBrakets(cc, unicode_1.RBRACE);
        return "WORD";
    }
    WHITESPACE(cc) {
        while (unicode_1.isWhitespace(cc)) {
            cc = this.next();
        }
        this.commitToken("whitespace", -1);
        this.back();
    }
    SLASH(cc) {
        if (cc === unicode_1.STAR) {
            return "COMMENT";
        }
        if (cc === unicode_1.SLASH && this.options.allowInlineCommnets) {
            return "INLINE_COMMENT";
        }
        this.commitToken("operator", -1);
        this.back();
    }
    COMMENT(cc) {
        while (cc !== unicode_1.EOF) {
            if (cc === unicode_1.STAR) {
                cc = this.next();
                if (cc === unicode_1.SLASH) {
                    this.commitToken("comment");
                    return;
                }
            }
            cc = this.next();
        }
        this.commitToken("comment", -1);
        this.reportParseError("eof-in-comment");
    }
    INLINE_COMMENT(cc) {
        while (cc !== unicode_1.EOF) {
            if (cc === unicode_1.LF || cc === unicode_1.FF) {
                this.commitToken("inline-comment");
                return;
            }
            if (cc === unicode_1.CR) {
                cc = this.next();
                if (cc === unicode_1.LF) {
                    this.commitToken("inline-comment");
                    return;
                }
                this.commitToken("inline-comment", -1);
                return this.back();
            }
            cc = this.next();
        }
        this.commitToken("inline-comment", -1);
    }
    MINUS(cc) {
        if (this.lastTokenType === "word" ||
            cc === unicode_1.EOF ||
            (cc !== unicode_1.MINUS && !maybeNumber(cc) && !unicode_1.isLetter(cc))) {
            this.commitToken("operator", -1);
            this.back();
            return;
        }
        return "WORD";
    }
    PLUS(cc) {
        if (this.lastTokenType !== "word") {
            if (maybeNumber(cc)) {
                return "WORD";
            }
        }
        this.commitToken("operator", -1);
        this.back();
    }
    DQUOTE(cc) {
        this.skipString(cc, unicode_1.DQUOTE);
    }
    SQUOTE(cc) {
        this.skipString(cc, unicode_1.SQUOTE);
    }
    skipBrakets(cc, end) {
        const closeStack = [];
        while (cc !== unicode_1.EOF) {
            if (end === cc) {
                const nextTargetBracket = closeStack.pop() || null;
                if (!nextTargetBracket) {
                    return;
                }
                end = nextTargetBracket;
            }
            else if (cc === unicode_1.LBRACE || cc === unicode_1.LBRACKET || cc === unicode_1.LPAREN) {
                if (end) {
                    closeStack.push(end);
                }
                end = getRightBracket(cc);
            }
            cc = this.next();
        }
        this.reportParseError("eof-in-bracket");
    }
    skipString(cc, end) {
        while (cc !== unicode_1.EOF) {
            if (cc === unicode_1.BACKSLASH) {
                cc = this.next();
            }
            else if (cc === end) {
                this.commitToken("string");
                return;
            }
            cc = this.next();
        }
        this.commitToken("string", -1);
        this.reportParseError("eof-in-string");
    }
};
tokenizer.Tokenizer = Tokenizer$1;

var resolvedType = {};

Object.defineProperty(resolvedType, "__esModule", { value: true });
const calc_notation_1$1 = calcNotation;
const utils_1$1 = utils;
function getResolvedType$1(expr) {
    const left = getType(expr.left);
    const right = getType(expr.right);
    const { operator } = expr;
    switch (operator) {
        case "+":
        case "-":
            if (left === "Unknown" || right === "Unknown") {
                return "Unknown";
            }
            if (left === right) {
                return left;
            }
            if (left === "Number" || right === "Number") {
                return "invalid";
            }
            if (left === "Percentage") {
                return right;
            }
            if (right === "Percentage") {
                return left;
            }
            return "invalid";
        case "*":
            if (left === "Unknown" || right === "Unknown") {
                return "Unknown";
            }
            if (left === "Number") {
                return right;
            }
            if (right === "Number") {
                return left;
            }
            return "invalid";
        case "/":
            if (right === "Unknown") {
                return "Unknown";
            }
            if (right === "Number") {
                return left;
            }
            return "invalid";
    }
    return "Unknown";
}
resolvedType.getResolvedType = getResolvedType$1;
function getExpressionType(expr) {
    const { type } = expr;
    if (type === "Number" ||
        type === "Length" ||
        type === "Angle" ||
        type === "Time" ||
        type === "Frequency" ||
        type === "Resolution" ||
        type === "Percentage" ||
        type === "Flex") {
        return type;
    }
    return "Unknown";
}
function getType(expr) {
    if (expr.type === "MathExpression") {
        const rtype = getResolvedType$1(expr);
        return rtype === "invalid" ? "Unknown" : rtype;
    }
    if (expr.type === "Parentheses") {
        if (expr.nodes.length === 1) {
            return getType(expr.nodes[0]);
        }
        return "Unknown";
    }
    if (expr.type === "Function") {
        if (calc_notation_1$1.isCalc(expr.name)) {
            return getCalcFunctionType(expr);
        }
        if (calc_notation_1$1.isMin(expr.name) || calc_notation_1$1.isMax(expr.name)) {
            return getMinMaxFunctionType(expr);
        }
        if (calc_notation_1$1.isClamp(expr.name)) {
            return getClampFunctionType(expr);
        }
        return "Unknown";
    }
    return getExpressionType(expr);
}
function getCalcFunctionType(fn) {
    if (fn.nodes.length === 1) {
        return getFunctionArgumentsType(fn);
    }
    return "Unknown";
}
function getMinMaxFunctionType(fn) {
    return getFunctionArgumentsType(fn);
}
function getClampFunctionType(fn) {
    if (fn.nodes.length === 5) {
        return getFunctionArgumentsType(fn);
    }
    return "Unknown";
}
function getFunctionArgumentsType(fn) {
    const args = utils_1$1.getFunctionArguments(fn);
    if (!args) {
        return "Unknown";
    }
    const types = args.map(getType);
    let result = null;
    for (const type of types) {
        if (!result || result === "Percentage") {
            result = type;
        }
        else if (type === "Percentage") ;
        else if (result !== type) {
            return "Unknown";
        }
    }
    return result || "Unknown";
}

var reducer = {};

Object.defineProperty(reducer, "__esModule", { value: true });
const calc_notation_1 = calcNotation;
const utils_1 = utils;
function reduce(expr) {
    return reduceExpression$1(expr);
}
reducer.reduce = reduce;
function reduceMathExpression(expr) {
    const left = reduceExpression$1(expr.left);
    const right = reduceExpression$1(expr.right);
    if (!left || !right) {
        return null;
    }
    switch (expr.operator) {
        case "+":
        case "-":
            return reduceAddSub(left, expr.operator, right);
        case "/":
            return reduceDivision(left, right);
        case "*":
            return reduceMultiple(left, right);
    }
    return null;
}
function reduceAddSub(left, operator, right) {
    if (left.type !== right.type) {
        return null;
    }
    const ope = operator === "-"
        ? (ln, rn) => ln - rn
        : (ln, rn) => ln + rn;
    if (left.type === "Number") {
        return {
            type: "Number",
            value: ope(left.value, right.value),
        };
    }
    const lunit = left.unit;
    const runit = right.unit;
    if (lunit === runit) {
        return {
            type: left.type,
            value: ope(left.value, right.value),
            unit: left.unit,
        };
    }
    return null;
}
function reduceDivision(left, right) {
    if (right.type !== "Number") {
        return null;
    }
    if (left.type === "Number") {
        return {
            type: "Number",
            value: left.value / right.value,
        };
    }
    return {
        type: left.type,
        value: left.value / right.value,
        unit: left.unit,
    };
}
function reduceMultiple(left, right) {
    if (left.type === "Number") {
        if (right.type === "Number") {
            return {
                type: "Number",
                value: left.value * right.value,
            };
        }
        return {
            type: right.type,
            value: left.value * right.value,
            unit: right.unit,
        };
    }
    else if (right.type === "Number") {
        return {
            type: left.type,
            value: left.value * right.value,
            unit: left.unit,
        };
    }
    return null;
}
function reduceExpression$1(expr) {
    if (expr.type === "Number" ||
        expr.type === "Length" ||
        expr.type === "Angle" ||
        expr.type === "Time" ||
        expr.type === "Frequency" ||
        expr.type === "Resolution" ||
        expr.type === "Percentage" ||
        expr.type === "Flex") {
        return expr;
    }
    if (expr.type === "MathExpression") {
        return reduceMathExpression(expr);
    }
    if (expr.type === "Parentheses" || expr.type === "Root") {
        if (expr.nodes.length === 1) {
            return reduceExpression$1(expr.nodes[0]);
        }
    }
    else if (expr.type === "Function") {
        if (expr.type === "Function") {
            if (calc_notation_1.isCalc(expr.name)) {
                return getCalcNumber(expr);
            }
        }
    }
    return null;
}
function getCalcNumber(fn) {
    const args = utils_1.getFunctionArguments(fn);
    if (args && args.length === 1) {
        return reduceExpression$1(args[0]);
    }
    return null;
}

Object.defineProperty(cssCalc, "__esModule", { value: true });
var parser_1 = parser;
cssCalc.Parser = parser_1.Parser;
var tokenizer_1 = tokenizer;
cssCalc.Tokenizer = tokenizer_1.Tokenizer;
var stringifier_1 = stringifier;
cssCalc.Stringifier = stringifier_1.Stringifier;
var resolved_type_1 = resolvedType;
cssCalc.getResolvedType = resolved_type_1.getResolvedType;
var reducer_1 = reducer;
cssCalc.reduceExpression = reducer_1.reduce;
var factory_1 = factory;
cssCalc.newMathExpression = factory_1.newMathExpression;

Object.defineProperty(dist, "__esModule", { value: true });
const AST = ast;
var AST_1 = dist.AST = AST;
const css_calc_1 = cssCalc;
var Parser = dist.Parser = css_calc_1.Parser;
var Tokenizer = dist.Tokenizer = css_calc_1.Tokenizer;
var Stringifier = dist.Stringifier = css_calc_1.Stringifier;
var getResolvedType = dist.getResolvedType = css_calc_1.getResolvedType;
var reduceExpression = dist.reduceExpression = css_calc_1.reduceExpression;
var mathExpr = dist.mathExpr = css_calc_1.newMathExpression;
function parse(code, options) {
    const tokenizer = new css_calc_1.Tokenizer(code, options);
    return new css_calc_1.Parser(tokenizer, options).parse();
}
var parse_1 = dist.parse = parse;
function stringify(node, options) {
    const stringifier = new css_calc_1.Stringifier(options);
    return stringifier.stringify(node);
}
var stringify_1 = dist.stringify = stringify;
var _default = dist.default = {
    parse,
    stringify,
    getResolvedType: css_calc_1.getResolvedType,
    reduceExpression: css_calc_1.reduceExpression,
    mathExpr: css_calc_1.newMathExpression,
    Parser: css_calc_1.Parser,
    Tokenizer: css_calc_1.Tokenizer,
    Stringifier: css_calc_1.Stringifier,
    AST,
};

export { AST_1 as AST, Parser, Stringifier, Tokenizer, _default as default, getResolvedType, mathExpr, parse_1 as parse, reduceExpression, stringify_1 as stringify };
