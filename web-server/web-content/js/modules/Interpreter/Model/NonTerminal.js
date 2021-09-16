import ParseTreeNode from './ParseTreeNode.js';

let map = [];

export default class TreeParser {
    constructor({ name, parse }) {
        this.name = name;
        this.parse = parse;
        map[name] = this;
    }
    parse(name, tokenGenerator) {
        const treeParser = map[name];
        if (treeParser === undefined) {
            throw `No TreeParser defined for ${name}`;
        }
        const prevTarget = tokenGenerator.target;
        const children = [];
        tokenGenerator.target = children;
        const args = treeParser.parse(tokenGenerator);
        tokenGenerator.target = prevTarget;
        return new ParseTreeNode({ ... args, children });
    }
}
