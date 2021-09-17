import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'struct-type',
    parse: ({ tokenGenerator }) => {
        tokenGenerator.pop('struct');
        const name = tokenGenerator.pop('id').content;
        return { name };
    },
});
