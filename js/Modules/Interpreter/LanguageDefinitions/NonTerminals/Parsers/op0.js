import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op0',
    parse: (ctx) => {
        const { token } = ctx;
        if (token.popIfIs('left-parentheses')) {
            const expr = ctx.parse('expr');
            token.pop('right-parentheses');
            return expr;
        }
        return token.nextIs('id') ? ctx.parse('id') : ctx.parse('const');
    },
});
