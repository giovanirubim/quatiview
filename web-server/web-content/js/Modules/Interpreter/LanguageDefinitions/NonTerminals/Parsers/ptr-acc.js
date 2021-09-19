import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-acc',
    parse: (ctx) => {
        ctx.token.pop('asterisk');
        return { operand: ctx.parse('op2') };
    },
});
