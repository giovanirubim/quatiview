import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'addr-of',
    parse: (ctx) => {
        ctx.token.pop('ampersand');
        return { operand: ctx.parse('op2') };
    },
});
