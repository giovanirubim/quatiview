import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'break',
    parse: (ctx) => {
        ctx.tokenGenerator.pop('break');
        ctx.tokenGenerator.pop('semicolon');
    },
});
