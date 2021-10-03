import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'for',
    parse: (ctx) => {
        const { token } = ctx;
        let init, cond, inc;
        token.pop('for');
        token.pop('left-parentheses');
        init = token.nextIs('semicolon') ? null : ctx.parse('expr');
        token.pop('semicolon'); 
        cond = token.nextIs('semicolon') ? null : ctx.parse('expr');
        token.pop('semicolon');
        inc = token.nextIs('right-parentheses') ? null : ctx.parse('expr');
        token.pop('right-parentheses');
        const scope = ctx.parse('scope');
        return { init, cond, inc, scope };
    },
    compile: (ctx, node) => {
        let { init, cond, inc, scope } = node.content;
        init = init ? ctx.compile(init) : null;
        cond = cond ? ctx.compile(cond) : {
            type: 'int',
            value: 1,
        };
        inc = inc ? ctx.compile(inc) : null;
        scope = ctx.compile(scope);
        return { instruction: 'for', init, cond, inc, scope };
    },
});
