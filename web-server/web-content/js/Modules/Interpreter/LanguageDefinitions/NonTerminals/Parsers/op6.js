import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op6',
    parse: (ctx) => {
        let root = ctx.parse('op5');
        for (;;) {
            const operator = ctx.token.popIfIs('equals', 'different');
            if (!operator) break;
            root = {
                operator: operator.content,
                left: root,
                right: ctx.parse('op5'),
            };
        }
        return root;
    },
});
