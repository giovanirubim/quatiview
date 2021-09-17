import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'arg-list',
    parse: (ctx) => {
        const items = [ ctx.parse('arg-item') ];
        while (ctx.tokenGenerator.nextIs('comma')) {
            items.push(ctx.parse('arg-item'));
        }
        return items;
    },
});
