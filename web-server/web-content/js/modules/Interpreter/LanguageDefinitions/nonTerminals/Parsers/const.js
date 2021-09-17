import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'const',
    parse: (ctx) => ctx.parseOneOf('int-const', 'char-const', 'str-const'),
});
