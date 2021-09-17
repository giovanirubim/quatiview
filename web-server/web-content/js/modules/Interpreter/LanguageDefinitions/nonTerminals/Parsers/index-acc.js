import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'index-acc',
    parse: (ctx) => {
        ctx.tokenGenerator.pop('left-square-brackets');
        const expr = ctx.parse('expr');
        ctx.tokenGenerator.pop('right-square-brackets');
        return { expr };
    },
});
