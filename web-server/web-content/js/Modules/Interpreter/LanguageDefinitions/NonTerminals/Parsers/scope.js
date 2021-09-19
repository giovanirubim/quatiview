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
});
