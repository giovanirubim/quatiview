import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import { isInt } from './Support/Type.js';

new NonTerminal({
    name: 'neg',
    parse: (ctx) => {
        ctx.token.pop('minus');
        return { operand: ctx.parse('op2') };
    },
    compile: (ctx, { content }) => {
        const { operand } = content;
        const arg = ctx.compile(operand);
        if (!isInt(arg.type)) {
            throw new CompilationError(
                `Invalid operand for operator '-'`,
                operand.startsAt,
            );
        }
        return { instruction: 'neg', arg, type: 'int' };
    }
});
