import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'index-acc',
    parse: (ctx) => {
        ctx.token.pop('left-square-brackets');
        const expr = ctx.parse('expr');
        ctx.token.pop('right-square-brackets');
        return { expr };
    },
    compile: (ctx, node) => {
        const array = ctx.operand;
        const addrType = array.type;
        const itemType = addrType.replace(/\*$/, '');
        const index = ctx.compile(node.content.expr);
        const addr = {
            instruction: 'sum',
            type: addrType,
            a: array,
            b: index,
            ctx,
        };
        return {
            instruction: 'ptr-acc',
            type: itemType,
            src: addr,
        };
    },
});
