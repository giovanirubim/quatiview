import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';

const addPutchar = (ctx) => {
    const arg = {
        name: 'c',
        type: 'char',
        size: 1,
        addr: [],
    };
    const byte = {
        instruction: 'load',
        src: arg,
    };
    const data = {
        name: 'putchar',
        type: 'void(*)(char)',
        returnType: 'void',
        argTypes: ['char'],
        vars: [arg],
        args: [arg],
        run: { instruction: 'putchar', byte },
    };
    ctx.global.set({ 'putchar': data });
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
        for (let line of node.content) {
            ctx.compile(line);
        }
        const main = ctx.global.get('main');
        if (!main) {
            throw new CompilationError(`'main' undeclared`);
        }
        return {
            instruction: 'call',
            fn: main,
            args: [],
            type: main.returnType,
        };
    },
});
