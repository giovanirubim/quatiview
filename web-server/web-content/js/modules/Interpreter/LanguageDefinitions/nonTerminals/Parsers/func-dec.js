import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'func-dec',
    parse: (ctx) => {
        const type = ctx.parse('type');
        const pointerCount = ctx.token.popMany('asterisk').length;
        const name = ctx.token.pop('id').content;
        ctx.token.pop('left-parentheses');
        const args = ctx.token.nextIs('right-parentheses') ? null : ctx.parse('arg-list');
        ctx.token.pop('right-parentheses');
        const scope = ctx.parse('scope');
        return { type, pointerCount, name, args };
    },
});
