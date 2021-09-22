import Run from '../';
import solve from './solve.js';

export default async ({ cond, scopeTrue, scopeFalse }) => {
    cond = await solve(cond);
    if (cond.value == null) {
        throw new Error('No value returned');
    }
    if (cond.value !== 0) {
        await Run(scopeTrue);
    } else if (scopeFalse != null) {
        await Run(scopeFalse);
    }
};
