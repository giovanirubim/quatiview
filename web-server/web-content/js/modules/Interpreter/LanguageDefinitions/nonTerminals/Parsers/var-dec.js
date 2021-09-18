import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-dec',
    parse: (ctx) => {
        const type = ctx.parse('type');
        const items = [ ctx.parse('var-item') ];
        const { token } = ctx;
        while (token.popIfIs('comma')) {
            items.push(ctx.parse('var-item'));
        }
        token.pop('semicolon');
        return { type, items };
    },
});
