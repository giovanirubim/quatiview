import NonTerminal from '../../../Model/NonTerminal.js';

const opToInst = {
    '<=': 'le',
    '>=': 'ge',
    '<':  'lt',
    '>':  'gt',
};

const compileTree = (ctx, node) => {
    const { left, operator, right } = node;
    if (left == null) {
        return ctx.compile(node);
    }
    const a = compileTree(ctx, left);
    const b = ctx.compile(right);
    return {
        instruction: opToInst[operator],
        a, b,
    };
};

new NonTerminal({
    name: 'op5',
    parse: (ctx) => {
        let root = ctx.parse('op4');
        for (;;) {
            const operator = ctx.token.popIfIs(
                'less-or-equal', 'less',
                'greater-or-equal', 'greater'
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
    compile: (ctx, node) => compileTree(ctx, node.content),
});
