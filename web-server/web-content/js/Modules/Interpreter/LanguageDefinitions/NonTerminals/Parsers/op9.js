import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op9',
    parse: (ctx) => {
        const left = ctx.parse('op8');
        if (!ctx.token.popIfIs('assign')) {
            return left;
        }
        const right = ctx.parse('op9');
        return { left, right };
    },
    compile: (ctx, node) => {
        const { left, right } = node.content;
        const dst = ctx.compile(left);
        const src = ctx.compile(right);
        return {
            instruction: 'assign',
            src, dst,
        };
    },
});
