import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'struct-dec',
    parse: (ctx) => {
        const { token } = ctx;
        const struct = {
            name: ctx.parse('struct-type').content,
            members: {},
            size: null,
        };
        ctx.structs[struct.name] = struct;
        ctx.push('structDec', struct);
        token.pop('left-brackets');
        ctx.parse('var-dec');
        while (!token.popIfIs('right-brackets')) {
            ctx.parse('var-dec');
        }
        token.pop('semicolon');
        struct.size = 0;
        for (let member in struct.members) {
            struct.size += struct.members[member].size;
        }
        ctx.pop('structDec');
    },
});
