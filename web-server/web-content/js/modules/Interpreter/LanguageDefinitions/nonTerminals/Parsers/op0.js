import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op0',
    parse: (ctx) => {
        const { tokenGenerator } = ctx;
        if (tokenGenerator.popIfIs('left-parentheses')) {
            const expr = ctx.parse('expr');
            tokenGenerator.pop('right-parentheses');
            return expr;
        }
        return tokenGenerator.pop('id', 'const');
    },
});
