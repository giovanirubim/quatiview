import Run from '../index.js';
import solve from './Support/solve.js';

export default async ({ ctx, cond, scope }) => {
    for (;;) {
        const { value } = await solve(cond);
        if (value === 0) {
            break;
        }
        await Run(scope);
        if (ctx.returned || ctx.broke) {
            break;
        }
    }
    ctx.broke = false;
};
