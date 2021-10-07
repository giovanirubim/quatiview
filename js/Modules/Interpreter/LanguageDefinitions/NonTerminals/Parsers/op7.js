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
            `Invalid operand to operator '&&'`,
            left.startsAt,
        );
    }
    const b = ctx.compile(right);
    if (!isIntOrPtr(b.type)) {
        throw new CompilationError(
            `Invalid operand to operator '&&'`,
            right.startsAt,
        );
    }
    return {
        instruction: 'and',
        a, b,
        type: 'int',
    };
};

new NonTerminal({
    name: 'op7',
    parse: (ctx) => {
        let root = ctx.parse('op6');
        while (ctx.token.popIfIs('logical-and')) {
            root = {
                left: root,
                right: ctx.parse('op6'),
            };
        }
        return root;
    },
    compile: (ctx, node) => compileTree(ctx, node.content),
});
