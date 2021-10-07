import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'local-line',
    parse: (ctx) => {
        const nonExpr = [ 'var-dec', 'while', 'for', 'if', 'return', 'break' ];
        const line = ctx.parseOneOf(...nonExpr, 'expr');
        if (!nonExpr.includes(line.name)) {
            ctx.token.pop('semicolon');
        }
        return line;
    },
});
