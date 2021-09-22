import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-acc',
    parse: (ctx) => {
        ctx.token.pop('asterisk');
        return { operand: ctx.parse('op2') };
    },
    compile: (ctx, { content }) => {
        const { operand } = content;
        const addr = ctx.compile(operand);
        return {
            instruction: 'ptr-acc',
            type: addr.type.replace(/\*$/, ''),
            addr,
        };
    }
});
