import solve from './solve.js';

export default async ({ a, b }) => {
    a = await solve(a);
    b = await solve(b);
    if (a.type === 'int' && b.type === 'int') {
        return {
            type: 'int',
            value: (a.value < b.value) | 0,
        };
    }
    throw new Error('dunno wat TODO');
};
