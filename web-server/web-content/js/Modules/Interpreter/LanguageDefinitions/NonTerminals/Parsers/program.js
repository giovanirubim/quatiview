import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'program',
    parse: (ctx) => {
        const lines = [];
        while (ctx.token.next()) {
            lines.push(ctx.parse('global-line'));
        }
        return lines;
    },
    compile: (ctx, node) => {
        for (let line of node.content) {
            ctx.compile(line);
        }
    },
});
