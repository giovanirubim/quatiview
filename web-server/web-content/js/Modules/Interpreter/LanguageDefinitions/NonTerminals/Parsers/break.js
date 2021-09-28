import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'break',
    parse: (ctx) => {
        ctx.token.pop('break');
        ctx.token.pop('semicolon');
    },
    compile: () => ({ instruction: 'break' }),
});
