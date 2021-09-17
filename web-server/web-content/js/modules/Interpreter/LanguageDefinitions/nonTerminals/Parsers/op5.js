import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op5',
    parse: (ctx) => {
        let root = ctx.parse('op4');
        for (;;) {
            const operator = ctx.tokenGenerator.popIfIs(
                'less-or-equal',
                'less',
                'greater-or-equal',
                'greater',
            );
            if (!operator) break;
            root = {
                operator: operator.content,
                left: root,
                right: ctx.parse('op4'),
            };
        }
        return root;
    },
});
