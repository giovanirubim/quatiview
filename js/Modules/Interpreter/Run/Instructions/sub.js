import solve from './Support/solve.js';

const isPtr = (type) => type.endsWith('*');
const isInt = (type) => type === 'int' || type === 'char';

export default async ({ ctx, a, b }) => {
    a = await solve(a);
    b = await solve(b);
    if (isInt(a.type) && isInt(b.type)) {
        return {
            type: 'int',
            value: a.value - b.value,
        };
    }
    if (isPtr(a.type) && isInt(b.type)) {
        const stride = ctx.getTypeSize(a.type.replace(/\*$/, ''));
        const offset = stride*b.value;
        return {
            type: a.type,
            value: a.value - offset,
        };
    }
    throw new Error('dunno wat TODO');
};
