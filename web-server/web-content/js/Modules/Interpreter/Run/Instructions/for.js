import Run from '../';
import solve from './Support/solve.js';

export default async ({ ctx, init, cond, inc, scope }) => {
    if (init !== null) {
        await Run(init);
    }
    for (;;) {
        if (cond !== null) {
            const { value } = await solve(cond);
            if (value === 0) {
                break;
            }
        }
        await Run(scope);
        if (ctx.returned || ctx.broke) {
            break;
        }
        if (inc !== null) {
            await Run(inc);
        }
    }
    ctx.broke = false;
};
