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
        const size = {
            type: 'int',
            value: ctx.getTypeSize(itemType, node),
        };
        const offset = {
            instruction: 'mul',
            type: 'int',
            a: index,
            b: size,
        };
        const addr = {
            instruction: 'sum',
            type: addrType,
            a: array,
            b: offset,
        };
        return {
            instruction: 'ptr-acc',
            type: itemType,
            addr,
        };
    },
});
