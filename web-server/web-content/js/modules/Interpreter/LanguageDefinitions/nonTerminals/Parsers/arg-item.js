import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'arg-item',
    parse: (ctx) => {
        const type = ctx.parse('type');
        const item = ctx.parse('var-item');
        return { type, item };
    },
});
