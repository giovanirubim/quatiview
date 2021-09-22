import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'arg-call',
    parse: (ctx) => {
        const args = [];
        ctx.token.pop('left-parentheses');
        if (ctx.token.popIfIs('right-parentheses')) {
            return args;
        }
        args.push(ctx.parse('expr'));
        while (ctx.token.popIfIs('comma')) {
            args.push(ctx.parse('expr'));
        }
        ctx.token.pop('right-parentheses');
        return args;
    },
    compile: (ctx, { content }) => {
        const fn = ctx.operand;
        const args = content.map((item) => ctx.compile(item));
        const res = {
            instruction: 'call',
            fn,
            args,
            type: fn.returnType,
        };
        return res;
    },
});
