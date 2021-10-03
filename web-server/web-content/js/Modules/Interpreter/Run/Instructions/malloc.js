import Net from '../../../Net.js';
import solve from './Support/solve.js';

export default async ({ ctx, arg }) => {
    const { value } = await solve(arg);
    const addr = Net.memory.allocate(value);
    ctx.returnValue = {
        type: 'int',
        value: addr,
    };
};
