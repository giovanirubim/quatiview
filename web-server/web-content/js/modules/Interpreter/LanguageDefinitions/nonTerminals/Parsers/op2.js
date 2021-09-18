import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op2',
    parse: (ctx) => ctx.parseOneOf(
        'neg',
        'ptr-acc',
        'not',
        'sizeof',
        'op1',
    ),
});
