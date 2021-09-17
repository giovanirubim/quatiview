import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'expr',
    parse: (ctx) => ctx.parse('op0'),
});
