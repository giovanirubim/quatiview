import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'const',
    parse: ({ token }) => token.pop(
        'int-const',
        'char-const',
        'str-const',
        'NULL',
    ),
});
