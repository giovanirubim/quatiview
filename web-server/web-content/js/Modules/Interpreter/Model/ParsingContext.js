import NonTerminal from "./NonTerminal.js";
import ParseTreeNode from "./ParseTreeNode.js";
import { CompilationError, SyntaticError } from "../../errors.js";

export default class ParsingContext {
    constructor({ tokenGenerator }) {
        this.token = tokenGenerator;
        this.structs = {};
        this.current = {
            varDec: null,
            struct: null,
        };
        this.stacks = {
            varDec: [],
            struct: [],
        };
    }
    push(a, b) {
        if (typeof a === 'string') {
            const [ name, value ] = [ a, b ];
            this.stacks[name].push(this.current[name]);
            this.current[name] = value;
        }
        if (a instanceof Object) {
            for (let name in a) {
                const value = a[name];
                this.push(name, value);
            }
        }
    }
    pop(...names) {
        for (let name of names) {
            this.current[name] = this.stacks[name].pop();
        }
    }
    getTypeSize(type, index) {
        if (type.endsWith('*')) return 4;
        if (type === 'char') return 1;
        if (type === 'int') return 4;
        if (type.startsWith('struct ')) {
            const [ name ] = type.match(/\b\w+$/);
            const size = this.structs[name]?.size;
            if (size != null) return size;
        }
        throw new CompilationError(
            `storage size of '${type}' isn't known`,
            index,
        );
    }
    getNonTerminal(name) {
        const nonTerminal = NonTerminal.getByName(name);
        if (nonTerminal == null) {
            throw `No NonTerminal defined for ${name}`;
        }
        return nonTerminal;
    }
    parse(name) {
        const { parse } = this.getNonTerminal(name);
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
    compile(node) {
        const { name } = node;
        const { compile } = this.getNonTerminal(name);
        if (compile == null) {
            throw `No compiler defined for ${name}`;
        }
        return compile(this, node);
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
                if (!(error instanceof SyntaticError)) {
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
