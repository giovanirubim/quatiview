import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'global-line',
    parse: (ctx) => {
        return ctx.parseOneOf('var-dec', 'fun-dec', 'struct-dec');
    },
});
