import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op3',
    parse: (ctx) => {
        let root = ctx.parse('op2');
        for (;;) {
            const operator = ctx.token.popIfIs('asterisk', 'slash', 'percent');
            if (!operator) break;
            root = {
                operator: operator.content,
                left: root,
                right: ctx.parse('op2'),
            };
        }
        return root;
    },
});
