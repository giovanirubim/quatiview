import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'void-type',
    parse: (ctx) => ctx.token.pop('void'),
});
