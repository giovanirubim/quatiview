import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'return',
    parse: (ctx) => {
        ctx.token.pop('return');
        const expr = ctx.token.nextIs('semicolon') ? null : ctx.parse('expr');
        ctx.token.pop('semicolon');
        return { expr };
    },
});
