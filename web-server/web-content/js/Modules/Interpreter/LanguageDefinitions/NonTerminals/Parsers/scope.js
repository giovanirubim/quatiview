import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'scope',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('left-brackets');
        const lines = [];
        while (!token.popIfIs('right-brackets')) {
            lines.push(ctx.parse('local-line'));
        }
        return lines;
    },
    compile: (ctx, { content: lines }) => {
        ctx.stackScope();
        const result = lines.map((line) => ctx.compile(line));
        ctx.popScope();
        return result.filter((line) => line?.instruction != null);
    },
});
