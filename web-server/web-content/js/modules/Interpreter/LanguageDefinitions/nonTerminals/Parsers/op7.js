import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op7',
    parse: (ctx) => {
        let root = ctx.parse('op6');
        while (ctx.tokenGenerator.popIfIs('logical-and')) {
            root = {
                left: root,
                right: ctx.parse('op6'),
            };
        }
        return root;
    },
});
