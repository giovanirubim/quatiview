import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'not',
    parse: (ctx) => {
        ctx.token.pop('exclamation-mark');
        return { operand: ctx.parse('op2') };
    },
});
