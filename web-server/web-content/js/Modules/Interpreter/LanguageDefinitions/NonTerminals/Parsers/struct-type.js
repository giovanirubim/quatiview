import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'struct-type',
    parse: ({ token }) => {
        token.pop('struct');
        return token.pop('id').content;
    },
    compile: (ctx, node) => {
    },
});
