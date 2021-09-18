import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op8',
    parse: (ctx) => {
        let root = ctx.parse('op7');
        while (ctx.token.popIfIs('logical-or')) {
            root = {
                left: root,
                right: ctx.parse('op7'),
            };
        }
        return root;
    },
});
