import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'neg',
    parse: (ctx) => {
        ctx.token.pop('minus');
        return { operand: ctx.parse('op2') };
    },
});
