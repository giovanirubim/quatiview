import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'neg',
    initialToken: 'minus',
    parse: (ctx) => {
        ctx.tokenGenerator.pop('minus');
        return { operand: ctx.parse('op2') };
    },
});
