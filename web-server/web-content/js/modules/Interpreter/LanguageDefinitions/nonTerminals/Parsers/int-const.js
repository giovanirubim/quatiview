import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'int-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('int-const'),
});
