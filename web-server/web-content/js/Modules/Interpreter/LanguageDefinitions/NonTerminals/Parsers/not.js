import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import { isStruct } from './Support/Type.js';

new NonTerminal({
    name: 'not',
    parse: (ctx) => {
        ctx.token.pop('exclamation-mark');
        return { operand: ctx.parse('op2') };
    },
    compile: (ctx, { content }) => {
        const { operand } = content;
        const arg = ctx.compile(operand);
        if (isStruct(arg.type)) {
            throw CompilationError(
                `Invalid operand for operator '!'`,
                operand.startsAt,
            );
        }
        return { instruction: 'not', arg, type: 'int' };
    },
});
