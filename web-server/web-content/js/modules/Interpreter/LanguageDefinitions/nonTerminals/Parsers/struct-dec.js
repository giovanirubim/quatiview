import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'struct-dec',
    parse: (ctx) => {
        const { token } = ctx;
        const name = ctx.parse('struct-type').content;
        token.pop('left-brackets');
        const vars = [ ctx.parse('var-dec') ];
        while (!token.popIfIs('right-brackets')) {
            vars.push(ctx.parse('var-dec'));
        }
        token.pop('semicolon');
        return { name, vars };
    },
});
