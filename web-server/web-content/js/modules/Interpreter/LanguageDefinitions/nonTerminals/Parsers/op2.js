import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op2',
    parse: (ctx) => ctx.parseOneOf(
        'neg',
        'ptr-acc',
        'addr-of',
        'not',
        'sizeof',
        'op1',
    ),
});
