import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-dec',
    parse: (ctx) => {
        const type = ctx.parse('type').content;
        const items = [ ctx.parse('var-item') ];
        while (ctx.token.popIfIs('comma')) {
            items.push(ctx.parse('var-item'));
        }
        ctx.token.pop('semicolon');
        return { type, items };
    },
    compile: (ctx, node) => {
        const { type: decType, items } = node.content;
        for (let item of items) {
            const { name, pointerCount } = item.content;
            const type = decType + '*'.repeat(pointerCount);
            const size = ctx.getTypeSize(type, item.startsAt);
            const { struct, fn } = ctx.current;
            if (struct) {
                struct.members[name] = { name, size, type, offset: null };
            } else {
                const data = {
                    name,
                    type,
                    size,
                    addr: [],
                };
                ctx.local.set(name, data);
                if (fn) fn.vars.push(data);
            }
        }
    },
});
