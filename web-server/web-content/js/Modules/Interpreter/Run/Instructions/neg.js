import solve from './Support/solve.js';

export default async ({ arg }) => {
    arg = await solve(arg);
    const res = {
        type: 'int',
        value: - arg.value,
    };
    return res;
};
