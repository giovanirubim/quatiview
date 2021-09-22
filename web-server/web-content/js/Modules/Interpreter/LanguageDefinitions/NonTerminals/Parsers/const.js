import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'const',
    parse: (ctx) => {
        if (ctx.token.popIfIs('NULL')) {
            return 0;
        }
        return ctx.parseOneOf(
            'int-const',
            'char-const',
            'str-const',
        );
    },
});
