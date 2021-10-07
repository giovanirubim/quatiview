import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';

const isInt = (type) => type === 'char' || type === 'int';
const isPtr = (type) => type.endsWith('*');

const getResType = (aType, bType, op) => {
    if (isInt(aType) && isInt(aType)) {
        return 'int';
    }
    if (op === '+') {
        if (isInt(aType) && isPtr(bType)) {
            return bType;
        }
        if (isInt(bType) && isPtr(aType)) {
            return aType;
        }
    }
    if (op === '-') {
        if (isPtr(aType) && isInt(bType)) {
            return aType;
        }
    }
};

const compileTree = (ctx, node) => {
    const { left, operator, right } = node;
    if (left == null) {
        return ctx.compile(node);
    }
    const a = compileTree(ctx, left);
    const b = ctx.compile(right);
    const op = operator.content;
    const type = getResType(a.type, b.type, op);
    if (!type) {
        throw new CompilationError(
            `Invalid operands to operator '${op}'`,
            operator.startsAt,
        );
    }
    return {
        instruction: op === '+' ? 'sum' : 'sub',
        a, b,
        type,
    };
};

new NonTerminal({
    name: 'op4',
    parse: (ctx) => {
        let root = ctx.parse('op3');
        for (;;) {
            const operator = ctx.token.popIfIs('plus', 'minus');
            if (!operator) break;
            root = {
                operator,
                left: root,
                right: ctx.parse('op3'),
            };
        }
        return root;
    },
    compile: (ctx, node) => compileTree(ctx, node.content),
});
