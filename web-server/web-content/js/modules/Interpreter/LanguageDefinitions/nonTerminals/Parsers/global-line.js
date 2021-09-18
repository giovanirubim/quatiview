import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'global-line',
    parse: (ctx) => ctx.parseOneOf('fun-dec', 'var-dec', 'struct-dec'),
});
