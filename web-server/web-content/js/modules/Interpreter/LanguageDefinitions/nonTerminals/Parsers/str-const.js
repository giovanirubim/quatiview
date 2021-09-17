import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'str-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('str-const'),
});
