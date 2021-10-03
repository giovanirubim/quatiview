import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'struct-dec',
    parse: (ctx) => {
        const { token } = ctx;
        const name = ctx.parse('struct-type').content;
        token.pop('left-brackets');
        const lines = [ ctx.parse('var-dec') ];
        while (!token.popIfIs('right-brackets')) {
            lines.push(ctx.parse('var-dec'));
        }
        token.pop('semicolon');
        return { name, lines };
    },
    compile: (ctx, node) => {
        const { name, lines } = node.content;
        const struct = {
            name,
            members: {},
            size: null,
            viewFlag: null,
        };
        ctx.structs[name] = struct;
        ctx.push({ struct });
        for (let line of lines) {
            ctx.compile(line);
        }
        struct.size = 0;
        for (let name in struct.members) {
            const member = struct.members[name];
            member.offset = struct.size;
            struct.size += member.size;
        }
        ctx.pop('struct');
    },
});
