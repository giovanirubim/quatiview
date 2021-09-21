import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'id',
    parse: (ctx) => {
        const name = ctx.token.pop('id').content;
        return { name };
    },
});
