import solve from './Support/solve.js';

export default async ({ ctx, arg }) => {
    if (arg) {
        ctx.returnValue = await solve(arg);
    }
    ctx.returned = true;
};
