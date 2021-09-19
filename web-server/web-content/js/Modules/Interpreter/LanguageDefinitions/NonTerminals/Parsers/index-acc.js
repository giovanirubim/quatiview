import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'index-acc',
    parse: (ctx) => {
        ctx.token.pop('left-square-brackets');
        const expr = ctx.parse('expr');
        ctx.token.pop('right-square-brackets');
        return { expr };
    },
});
