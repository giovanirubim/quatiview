import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op4',
    parse: (ctx) => {
        let root = ctx.parse('op3');
        for (;;) {
            const operator = ctx.token.popIfIs(
                'plus',
                'minus',
            );
            if (!operator) break;
            root = {
                operator: operator.content,
                left: root,
                right: ctx.parse('op3'),
            };
        }
        return root;
    },
});
