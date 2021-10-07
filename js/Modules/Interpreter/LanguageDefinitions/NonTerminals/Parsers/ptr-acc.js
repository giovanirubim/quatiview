import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-acc',
    parse: (ctx) => {
        ctx.token.pop('asterisk');
        return { operand: ctx.parse('op2') };
    },
    compile: (ctx, { content }) => {
        const { operand } = content;
        const src = ctx.compile(operand);
        return {
            instruction: 'ptr-acc',
            type: src.type.replace(/\*$/, ''),
            src,
        };
    }
});
