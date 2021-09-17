import ParseTreeNode from './ParseTreeNode.js';

let map = [];

export default class TreeParser {
    constructor({ name, parse }) {
        this.name = name;
        this.parse = parse;
        map[name] = this;
    }
    static parse(name, { tokenGenerator }) {
        const nonTerminal = map[name];
        if (nonTerminal === undefined) {
            throw `No TreeParser defined for ${name}`;
        }
        const prevTarget = tokenGenerator.target;
        const children = [];
        tokenGenerator.target = children;
        const content = nonTerminal.parse({ tokenGenerator });
        tokenGenerator.target = prevTarget;
        return new ParseTreeNode({ name, content, children });
    }
}
