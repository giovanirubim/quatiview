import NonTerminal from '../../../Model/NonTerminal.js';

const opToInst = {
    '*': 'mul',
    '/': 'div',
    '%': 'mod',
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
        type: 'int',
    };
};

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
    compile: (ctx, node) => compileTree(ctx, node.content),
});
