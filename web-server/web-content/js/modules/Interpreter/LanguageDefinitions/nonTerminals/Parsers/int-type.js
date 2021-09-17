import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'int-type',
    parse: (ctx) => ctx.tokenGenerator.pop('int', 'char'),
});
