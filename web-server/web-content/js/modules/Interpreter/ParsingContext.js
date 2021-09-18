import NonTerminal from "./Model/NonTerminal.js";
import ParseTreeNode from "./Model/ParseTreeNode.js";
import { CompilationError } from "../errors.js";

export default class ParsingContext {
    constructor({ tokenGenerator }) {
        this.token = tokenGenerator;
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
        const { token } = this;
        const prevTarget = token.target;
        const children = [];
        token.target = children;
        const content = parse(this);
        token.target = prevTarget;
        if (content instanceof ParseTreeNode) {
            return content;
        }
        return new ParseTreeNode({ name, content, children });
    }
    parseOneOf(...names) {
        let furthestError = null;
        const { token } = this;
        const state = token.getState();
        for (let name of names) {
            try {
                return this.parse(name);
            } catch(error) {
                token.setState(state);
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