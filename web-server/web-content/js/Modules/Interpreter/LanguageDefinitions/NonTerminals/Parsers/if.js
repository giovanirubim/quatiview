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
    compile: (ctx, { content }) => {
        const { cond, scopeTrue, scopeFalse } = content;
        return {
            instruction: 'if',
            cond: ctx.compile(cond),
            scopeTrue: ctx.compile(scopeTrue),
            scopeFalse: scopeFalse ? ctx.compile(scopeFalse) : null,
        };
    },
});
