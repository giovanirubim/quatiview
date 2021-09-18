import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'if',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('while');
        token.pop('left-parentheses');
        const cond = ctx.parse('expr');
        token.pop('right-parentheses');
        const scope = ctx.parse('scope');
        return { cond, scope };
    },
});
