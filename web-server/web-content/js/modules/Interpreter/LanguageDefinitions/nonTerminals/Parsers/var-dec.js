import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-dec',
    parse: (ctx) => {
        const type = ctx.parse('type');
        const items = [ ctx.parse('var-item') ];
        const { tokenGenerator } = ctx;
        while (tokenGenerator.popIfIs('comma')) {
            items.push(ctx.parse('var-item'));
        }
        tokenGenerator.pop('semicolon');
        return { type, items };
    },
});
