import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import typeIsStruct from './Support/typeIsStruct.js';

new NonTerminal({
    name: 'not',
    parse: (ctx) => {
        ctx.token.pop('exclamation-mark');
        return { operand: ctx.parse('op2') };
    },
    compile: (ctx, { content }) => {
        const { operand } = content;
        const arg = ctx.compile(operand);
        if (typeIsStruct(arg.type)) {
            throw CompilationError(
                `Invalid operand for operator '!'`,
                operand.startsAt,
            );
        }
        return { instruction: 'not', arg };
    },
});
