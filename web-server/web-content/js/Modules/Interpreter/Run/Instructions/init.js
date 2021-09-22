import Run from '../';
import Net from '../../../Net.js';

export default async ({ ctx }) => {
    const main = ctx.global.get('main');
    const { consts } = ctx;
    for (let item of consts) {
        const addr = Net.memory.allocate(item.bytes.length);
        item.value = addr;
    }
    await Run({
        instruction: 'call',
        fn: main,
        args: [],
        type: main.returnType,
        ctx,
    });
    for (let item of consts) {
        Net.memory.free(item.value);
    }
};
