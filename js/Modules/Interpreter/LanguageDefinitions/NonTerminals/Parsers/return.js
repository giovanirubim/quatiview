import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import { isStruct } from './Support/Type.js';

new NonTerminal({
    name: 'return',
    parse: (ctx) => {
        ctx.token.pop('return');
        const expr = ctx.token.nextIs('semicolon') ? null : ctx.parse('expr');
        ctx.token.pop('semicolon');
        return { expr };
    },
    compile: (ctx, node) => {
        const { expr } = node.content;
        const { fn } = ctx.current;
        if (!expr) {
            if (fn.returnType === 'void') {
                return { instruction: 'ret', arg: null };
            }
            throw new CompilationError(
                `'return' with no value, in function returning non-void`,
                node.startsAt,
            );
        } else if (fn.returnType === 'void') {
            throw new CompilationError(
                `'return' with a value, in function returning void`,
                node.startsAt,
            );
        }
        const arg = ctx.compile(expr);
        if (isStruct(arg.type) != isStruct(fn.returnType)) {
            throw new CompilationError(`incompatible return type`, node.startsAt);
        }
        if (isStruct(arg.type) && arg.type !== fn.returnType) {
            throw new CompilationError(`incompatible return type`, node.startsAt);
        }
        return { instruction: 'ret', arg };
    },
});
