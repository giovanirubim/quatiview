import NonTerminal from '../../../Model/NonTerminal.js';

const compileTree = (ctx, node) => {
    const { left, operator, right } = node;
    if (left == null) {
        return ctx.compile(node);
    }
    const a = compileTree(ctx, left);
    const b = ctx.compile(right);
    return {
        instruction: operator === '+' ? 'sum' : 'sub',
        a, b,
    };
};

new NonTerminal({
    name: 'op4',
    parse: (ctx) => {
        let root = ctx.parse('op3');
        for (;;) {
            const operator = ctx.token.popIfIs('plus', 'minus');
            if (!operator) break;
            root = {
                operator: operator.content,
                left: root,
                right: ctx.parse('op3'),
            };
        }
        return root;
    },
    compile: (ctx, node) => compileTree(ctx, node.content),
});
