import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-dec',
    parse: (ctx) => {
        const type = ctx.parse('type').content;
        const size = ctx.getTypeSize(type);
        ctx.push('varDec', { type, size });
        ctx.parse('var-item');
        while (ctx.token.popIfIs('comma')) {
            ctx.parse('var-item');
        }
        ctx.token.pop('semicolon');
        ctx.pop('varDec');
    },
});
