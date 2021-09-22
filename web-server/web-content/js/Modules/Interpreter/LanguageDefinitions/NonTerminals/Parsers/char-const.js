import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'char-const',
    parse: (ctx) => {
        const str = ctx.token.pop('char-const').content;
        if (str.length === 3) {
            return str.charCodeAt(1);
        }
        switch (str[2]) {
            case '0': return 0;
            case 'n': return '\n'.charCodeAt(0);
        }
        return str.charCodeAt(2);
    },
});
