import Net from '../../../Net.js';
import Run from '../';

export default async ({ ctx, size }) => {
    const { value } = await Run(size);
    ctx.returnValue = {
        type: 'int',
        value: Net.memory.allocate(value),
    };
};
