import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'if',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('if');
        token.pop('left-parentheses');
        const cond = ctx.parse('expr');
        token.pop('right-parentheses');
        const scopeTrue = ctx.parse('scope');
        const scopeFalse = token.popIfIs('else') ? ctx.parse('scope') : null;
        return { cond, scopeTrue, scopeFalse };
    },
});
