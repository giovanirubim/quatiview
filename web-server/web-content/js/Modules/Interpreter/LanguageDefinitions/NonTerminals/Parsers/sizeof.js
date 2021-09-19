import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'sizeof',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('sizeof');
        token.pop('left-parentheses');
        const type = ctx.parse('type');
        const pointerCount = token.popMany('*').length;
        token.pop('right-parentheses');
        return { type, pointerCount };
    },
});
