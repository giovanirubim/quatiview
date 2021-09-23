import NonTerminal from "./NonTerminal.js";
import ParseTreeNode from "./ParseTreeNode.js";
import Scope from './Scope.js';
import { CompilationError, SyntaticError } from "../../errors.js";

export default class ParsingContext {
    constructor({ tokenGenerator }) {
        this.token = tokenGenerator;
        this.structs = {};
        this.consts = [];
        this.operand = null;
        this.returned = false;
        this.returnValue = null;
        this.current = {
            varDec: null,
            struct: null,
        };
        this.stacks = {
            varDec: [],
            struct: [],
        };
        const globalScope = new Scope();
        this.global = globalScope;
        this.local = globalScope;
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
    stackScope() {
        this.local = new Scope(this.local);
    }
    popScope() {
        this.local = this.local.parent;
    }
    getTypeSize(type, index) {
        if (type.endsWith('*')) return 4;
        if (type === 'char') return 1;
        if (type === 'int') return 4;
        if (/^struct\s/.test(type)) {
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
        const startsAt = token.nextIndex;
        const content = parse(this);
        const endsAt = token.lastIndex;
        if (content instanceof ParseTreeNode) {
            return content;
        }
        return new ParseTreeNode({ name, startsAt, endsAt, content });
    }
    compile(node) {
        const { name } = node;
        const { compile } = this.getNonTerminal(name);
        if (compile == null) {
            throw `No compiler defined for ${name}`;
        }
        const instruction = compile(this, node);
        if (!instruction) return null;
        instruction.ctx = this;
        return instruction;
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
