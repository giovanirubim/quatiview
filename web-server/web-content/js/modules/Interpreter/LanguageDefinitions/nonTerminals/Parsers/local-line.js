import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'local-line',
    parse: (ctx) => {
        const line = ctx.parseOneOf(
            'var-dec', 'while', 'for', 'if', 'return', 'break', 'expr'
        );
        if (line.name === 'expr') {
            ctx.token.pop('semicolon');
        }
        return line;
    },
});
