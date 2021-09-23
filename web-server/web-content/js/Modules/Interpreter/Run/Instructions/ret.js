import solve from './Support/solve.js';

export default async ({ ctx, arg }) => {
    ctx.returned = true;
    if (!arg) {
        return;
    }
    ctx.returnValue = solve(arg);
};
