import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'arg-call',
    parse: (ctx) => {
        const args = [];
        ctx.tokenGenerator.pop('left-parentheses');
        if (ctx.tokenGenerator.popIfIs('right-parentheses')) {
            return args;
        }
        args.push(ctx.parse('expr'));
        while (ctx.tokenGenerator.popIfIs('comma')) {
            args.push(ctx.parse('expr'));
        }
        ctx.tokenGenerator.pop('right-parentheses');
        return args;
    },
});
