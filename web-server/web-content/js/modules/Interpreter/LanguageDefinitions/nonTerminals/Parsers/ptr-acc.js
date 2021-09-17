import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-acc',
    parse: (ctx) => {
        ctx.tokenGenerator.pop('asterisk');
        return { operand: ctx.parse('op2') };
    },
});
