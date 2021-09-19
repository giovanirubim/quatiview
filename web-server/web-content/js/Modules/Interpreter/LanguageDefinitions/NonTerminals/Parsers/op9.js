import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'op9',
    parse: (ctx) => {
        const left = ctx.parse('op8');
        if (!ctx.token.popIfIs('assign')) {
            return left;
        }
        const right = ctx.parse('op9');
        return { left, right };
    },
});
