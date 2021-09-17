import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'type',
    parse: (ctx) => ctx.parseOneOf(
        'int-type',
        'struct-type',
        'void-type',
    ),
});
