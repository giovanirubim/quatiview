import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';

const addPutchar = (ctx) => {
    const arg = { name: 'chr', type: 'char', size: 1, addr: [] };
    const byte = { instruction: 'load', src: arg };
    const data = {
        name: 'putchar',
        type: 'void(*)(char)',
        returnType: 'void',
        argTypes: ['char'], vars: [arg], args: [arg],
        run: { instruction: 'putchar', byte, ctx },
    };
    ctx.global.set({ 'putchar': data });
};

const addMalloc = (ctx) => {
    const arg = { name: 'size', type: 'int', size: 4, addr: [] };
    const size = { instruction: 'load', src: arg };
    const data = {
        name: 'malloc',
        type: 'void(*)(int)',
        returnType: 'void',
        argTypes: ['int'], vars: [arg], args: [arg],
        run: { instruction: 'malloc', size, ctx },
    };
    ctx.global.set({ 'malloc': data });
};

const addFree = (ctx) => {
    const arg = { name: 'addr', type: 'void*', size: 4, addr: [] };
    const addr = { instruction: 'load', src: arg };
    const data = {
        name: 'free',
        type: 'void(*)(void*)',
        returnType: 'void',
        argTypes: ['void*'], vars: [arg], args: [arg],
        run: { instruction: 'free', addr, ctx },
    };
    ctx.global.set({ 'free': data });
};

const flagViewStructs = ({ structs }) => {
    for (let name in structs) {
        const struct = structs[name];
        const ptrType = `struct ${name}*`;
        const members = Object.values(struct.members);
        const types = members.map(({ type }) => type).join('; ');
        if (types === `int; ${ptrType}; ${ptrType}`) {
            struct.viewFlag = 'binary_search_tree';
        } else if (types === `int; ${ptrType}`) {
            struct.viewFlag = 'linked_list';
        }
    }
};

new NonTerminal({
    name: 'program',
    parse: (ctx) => {
        const lines = [];
        while (ctx.token.next()) {
            lines.push(ctx.parse('global-line'));
        }
        return lines;
    },
    compile: (ctx, node) => {
        addPutchar(ctx);
        addMalloc(ctx);
        addFree(ctx);
        for (let line of node.content) {
            ctx.compile(line);
        }
        const main = ctx.global.get('main');
        if (!main) {
            throw new CompilationError(`'main' undeclared`);
        }
        flagViewStructs(ctx);
        return { instruction: 'init' };
    },
});
