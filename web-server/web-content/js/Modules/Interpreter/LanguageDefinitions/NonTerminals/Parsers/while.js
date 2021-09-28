import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'while',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('while');
        token.pop('left-parentheses');
        const cond = ctx.parse('expr');
        token.pop('right-parentheses');
        const scope = ctx.parse('scope');
        return { cond, scope };
    },
    compile: (ctx, node) => {
        let { cond, scope } = node.content;
        cond = ctx.compile(cond);
        scope = ctx.compile(scope);
        return {
            instruction: 'while',
            cond, scope,
        };
    },
});
