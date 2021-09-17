import NonTerminal from "./Model/NonTerminal.js";
import ParseTreeNode from './Model/ParseTreeNode.js'

export default class TreeParser {
    static parse(name, { tokenGenerator }) {
        const nonTerminal = NonTerminal.getByName(name);
        if (nonTerminal == null) {
            throw `No NonTerminal defined for ${name}`;
        }
        const { parse } = nonTerminal;
        if (parse == null) {
            throw `No parser defined for ${name}`;
        }
        const prevTarget = tokenGenerator.target;
        const children = [];
        tokenGenerator.target = children;
        const content = parse({ tokenGenerator });
        tokenGenerator.target = prevTarget;
        return new ParseTreeNode({ name, content, children });
    }
}
