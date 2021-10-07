import solve from './Support/solve.js';

export default async ({ a, b }) => {
    a = await solve(a);
    b = await solve(b);
    return {
        type: 'int',
        value: (a.value !== 0) & (b.value !== 0),
    };
};
