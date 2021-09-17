import NonTerminal from "./Model/NonTerminal.js";
import ParseTreeNode from "./Model/ParseTreeNode.js";
import { CompilationError } from "../errors.js";

export default class ParsingContext {
    constructor({ tokenGenerator }) {
        this.tokenGenerator = tokenGenerator;
    }
    parse(name) {
        const nonTerminal = NonTerminal.getByName(name);
        if (nonTerminal == null) {
            throw `No NonTerminal defined for ${name}`;
        }
        const { parse } = nonTerminal;
        if (parse == null) {
            throw `No parser defined for ${name}`;
        }
        const { tokenGenerator } = this;
        const prevTarget = tokenGenerator.target;
        const children = [];
        tokenGenerator.target = children;
        const content = parse(this);
        tokenGenerator.target = prevTarget;
        if (content instanceof ParseTreeNode) {
            return content;
        }
        return new ParseTreeNode({ name, content, children });
    }
    parseOneOf(...names) {
        let furthestError = null;
        const { tokenGenerator } = this;
        const state = tokenGenerator.getState();
        for (let name of names) {
            try {
                return this.parse(name);
            } catch(error) {
                tokenGenerator.setState(state);
                if (!(error instanceof CompilationError)) {
                    throw error;
                }
                if (furthestError && furthestError.index > error.index) {
                    continue;
                }
                furthestError = error;
            }
        }
        throw furthestError;
    }
}