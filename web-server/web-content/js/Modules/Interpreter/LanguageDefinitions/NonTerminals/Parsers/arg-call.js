import NonTerminal from '../../../Model/NonTerminal.js';
import typeIsStruct from './Support/typeIsStruct.js';

new NonTerminal({
    name: 'arg-call',
    parse: (ctx) => {
        const args = [];
        ctx.token.pop('left-parentheses');
        if (ctx.token.popIfIs('right-parentheses')) {
            return args;
        }
        args.push(ctx.parse('expr'));
        while (ctx.token.popIfIs('comma')) {
            args.push(ctx.parse('expr'));
        }
        ctx.token.pop('right-parentheses');
        return args;
    },
    compile: (ctx, { content }) => {
        const fn = ctx.operand;
        const args = content.map((item) => ctx.compile(item));
        let structAllocation = null;
        if (content.length === 1 && content[0].name === 'sizeof') {
            const type = content[0].content;
            if (typeIsStruct(type) && ctx.operand.name === 'malloc') {
                structAllocation = type.replace(/^struct\s/, '');
            }
        }
        const res = {
            instruction: 'call',
            fn,
            args,
            type: fn.returnType,
            structAllocation,
        };
        return res;
    },
});
