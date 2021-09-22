import NonTerminal from '../../../Model/NonTerminal.js';

const compileTree = (ctx, node) => {
    const { left, operator, right } = node;
    if (left == null) {
        return ctx.compile(node);
    }
    const a = compileTree(ctx, left);
    const b = ctx.compile(right);
    const name = '==' ? 'eq' : 'dif';
    const res = {
        instruction: name,
        a,
        b,
    };
    console.log(res);
    return res;
};

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
    compile: (ctx, node) => compileTree(ctx, node.content),
});
