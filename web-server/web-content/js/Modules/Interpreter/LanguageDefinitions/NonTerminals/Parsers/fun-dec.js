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
        ctx.stackScope();
        const fn = ctx.createUid({
            name,
            type: null,
            returnType,
            argTypes: [],
            args: [],
            vars: [],
            run: null,
        });
        for (let { content } of args) {
            const { type: typeItem, item } = content;
            const { name } = item.content;
            const type = typeItem.content + '*'.repeat(item.content.pointerCount);
            const size = ctx.getTypeSize(type, typeItem.startsAt);
            const data = ctx.createUid({
                name,
                type,
                size,
                addr: [],
            });
            ctx.local.set(name, data);
            fn.vars.push(data);
            fn.args.push(data);
            fn.argTypes.push(type);
        }
        fn.type = `${returnType}(*)(${fn.argTypes.join(',')})`;
        ctx.global.set(name, fn);
        ctx.current.fn = fn;
        fn.run = ctx.compile(scope);
        ctx.current.fn = null;
        ctx.popScope();
    },
});
