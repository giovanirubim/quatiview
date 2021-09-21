import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'fun-dec',
    parse: (ctx) => {
        const type = ctx.parse('type').content;
        const pointerCount = ctx.token.popMany('asterisk').length;
        const name = ctx.token.pop('id').content;
        ctx.token.pop('left-parentheses');
        const args = ctx.token.nextIs('right-parentheses') ? (
            []
        ) : (
            ctx.parse('arg-list').content
        );
        ctx.token.pop('right-parentheses');
        const scope = ctx.parse('scope');
        return {
            returnType: type + '*'.repeat(pointerCount),
            name, args, scope
        };
    },
    compile: (ctx, node) => {
        const { returnType, name, args, scope } = node.content;
        for (let { content } of args) {
            const { type: typeItem, item } = content;
            const type = typeItem.content + '*'.repeat(item.content.pointerCount);
            const size = ctx.getTypeSize(type, typeItem.startsAt);
        }
    },
});
