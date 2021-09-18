import NonTerminal from "./NonTerminal.js";
import ParseTreeNode from "./ParseTreeNode.js";
import { CompilationError } from "../../errors.js";

export default class ParsingContext {
    constructor({ tokenGenerator }) {
        this.token = tokenGenerator;
        this.structs = {};
        this.current = {
            varDecType: null,
        };
        this.stacks = {
            varDecType: [],
        };
    }
    pushData(name, value) {
        this.stacks[name].push(this.current[name]);
        this.current[name] = value;
    }
    popData(name) {
        this.current[name] = this.stacks[name].pop();
    }
    getTypeSize(type, index) {
        if (type.endsWith('*')) return 4;
        if (type === 'char') return 1;
        if (type === 'int') return 4;
        if (type.startsWith('struct ')) {
            const [ name ] = type.match(/\s\w+$/);
            const size = this.structs[name]?.size;
            if (size != null) return size;
        }
        throw new CompilationError(
            `storage size of '${type}' isn't known`,
            index,
        );
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

window.ctx = new ParsingContext({ });