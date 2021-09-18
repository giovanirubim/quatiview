import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'global-line',
    parse: (ctx) => ctx.parseOneOf('func-dec', 'var-dec', 'struct-dec'),
});
