import Net from '../../../Net.js';
import Run from '../';

export default async ({ ctx, size }) => {
    const { value } = await Run(size);
    const addr = Net.memory.allocate(value);
    ctx.returnValue = {
        type: 'int',
        value: addr,
    };
};
