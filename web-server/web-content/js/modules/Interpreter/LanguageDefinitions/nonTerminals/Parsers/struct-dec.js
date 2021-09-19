import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'struct-dec',
    parse: (ctx) => {
        const { token } = ctx;
        const structDef = {
            name: ctx.parse('struct-type').content,
            members: {},
            currentOffset: 0,
            size: null,
        };
        ctx.push('structDec', structDef);
        token.pop('left-brackets');
        ctx.parse('var-dec');
        while (!token.popIfIs('right-brackets')) {
            ctx.parse('var-dec');
        }
        ctx.pop('structDec');
        token.pop('semicolon');
    },
});
