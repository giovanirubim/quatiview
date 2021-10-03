import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'int-type',
    parse: (ctx) => ctx.token.pop('int', 'char'),
});
