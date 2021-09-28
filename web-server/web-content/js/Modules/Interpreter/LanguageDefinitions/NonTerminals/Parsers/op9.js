import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import assignIsCompatible from './Support/assignIsCompatible.js';

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
    compile: (ctx, node) => {
        const { left, right } = node.content;
        const dst = ctx.compile(left);
        const src = ctx.compile(right);
        if (!assignIsCompatible(dst.type, src.type)) {
            throw new CompilationError(
                `incompatible types when assigning to type '${dst.type}' from type '${src.type}'`,
                node.startsAt,
            );
        }
        return {
            instruction: 'assign',
            src,
            dst,
            type: src.type,
        };
    },
});
