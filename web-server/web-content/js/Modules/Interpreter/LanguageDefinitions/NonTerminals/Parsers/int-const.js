import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'int-const',
    parse: (ctx) => {
        return Number(ctx.token.pop('int-const').content);
    },
    compile: ({ content }) => ({
        type: 'int',
        value: content,
    }),
});
