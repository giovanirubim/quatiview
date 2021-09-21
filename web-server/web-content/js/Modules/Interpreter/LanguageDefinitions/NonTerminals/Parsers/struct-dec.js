import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'struct-dec',
    parse: (ctx) => {
        const { token } = ctx;
        const name = ctx.parse('struct-type').content;
        token.pop('left-brackets');
        const lines = [];
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
        };
        ctx.push({ struct });
        for (let line of lines) {
            ctx.compile(line);
        }
        ctx.pop('struct');
    },
});
