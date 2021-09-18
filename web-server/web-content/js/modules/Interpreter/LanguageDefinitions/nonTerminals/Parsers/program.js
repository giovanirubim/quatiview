import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'program',
    parse: (ctx) => {
        const lines = [];
        while (!ctx.token.end()) {
            lines.push(ctx.parse('global-line'));
        }
        return lines;
    },
});
