import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'sizeof',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('sizeof');
        token.pop('left-parentheses');
        const type = ctx.parse('type');
        const pointerCount = token.popMany('asterisk').length;
        token.pop('right-parentheses');
        return type.content + '*'.repeat(pointerCount);
    },
    compile: (ctx, node) => {
        let type = node.content;
        return {
            type: 'int',
            value: ctx.getTypeSize(type, node.startsAt),
        };
    },
});
