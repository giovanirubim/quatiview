import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'type',
    parse: (ctx) => {
        const { name, content } = ctx.parseOneOf(
            'int-type',
            'struct-type',
            'void-type',
        );
        return name === 'struct-type' ? `struct ${content}` : content;
    }
});
