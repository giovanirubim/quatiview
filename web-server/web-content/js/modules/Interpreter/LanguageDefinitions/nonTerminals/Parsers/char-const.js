import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'char-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('char-const'),
});
