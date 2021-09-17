import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op2',
    parse: (ctx) => ctx.parseOneOf(
        'neg',
        'ptr_acc',
        'addr_of',
        'not',
        'sizeof',
        'op1',
    ),
});
