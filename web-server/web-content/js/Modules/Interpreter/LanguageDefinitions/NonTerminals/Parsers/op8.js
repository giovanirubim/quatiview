import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import { isIntOrPtr } from './Support/Type.js';

const compileTree = (ctx, node) => {
    const { left, right } = node;
    if (left == null) {
        return ctx.compile(node);
    }
    const a = compileTree(ctx, left);
    if (!isIntOrPtr(a.type)) {
        throw new CompilationError(
            `Invalid operand to operator '||'`,
            left.startsAt,
        );
    }
    const b = ctx.compile(right);
    if (!isIntOrPtr(b.type)) {
        throw new CompilationError(
            `Invalid operand to operator '||'`,
            right.startsAt,
        );
    }
    return {
        instruction: 'or',
        a, b,
        type: 'int',
    };
};

new NonTerminal({
    name: 'op8',
    parse: (ctx) => {
        let root = ctx.parse('op7');
        while (ctx.token.popIfIs('logical-or')) {
            root = {
                left: root,
                right: ctx.parse('op7'),
            };
        }
        return root;
    },
    compile: (ctx, node) => compileTree(ctx, node.content),
});
