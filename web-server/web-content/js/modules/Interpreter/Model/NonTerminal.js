import ParseTreeNode from './ParseTreeNode.js';

let map = [];

export default class NonTerminal {
    constructor({ name, parse }) {
        this.name = name;
        this.parse = parse;
        map[name] = this;
    }
    parse(name, tokenGenerator) {
        const nonTerminal = map[name];
        if (nonTerminal === undefined) {
            throw `No NonTerminal defined for ${name}`;
        }
        const prevTarget = tokenGenerator.target;
        const children = [];
        tokenGenerator.target = children;
        const args = nonTerminal.parse(tokenGenerator);
        tokenGenerator.target = prevTarget;
        return new ParseTreeNode({ ... args, children });
    }
}
