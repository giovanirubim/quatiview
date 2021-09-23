import solve from './Support/solve.js';

const isIntLike = (type) => type.endsWith('*') || type === 'int' || type === 'char';

export default async ({ a, b }) => {
    a = await solve(a);
    b = await solve(b);
    if (isIntLike(a.type) && isIntLike(b.type)) {
        return {
            type: 'int',
            value: (a.value == b.value) | 0,
        };
    }
    throw new Error(`dunno wat TODO ${a.type} == ${b.type}`);
};
