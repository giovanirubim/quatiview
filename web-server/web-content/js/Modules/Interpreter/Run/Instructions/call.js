import Run from '../';
import Net from '../../../Net.js';

export default async ({ ctx, args, fn }) => {
    for (let item of fn.vars) {
        const addr = Net.memory.allocate(item.size);
        item.addr.push(addr);
    }
    for (let i=0; i<args.length; ++i) {
        await Run({
            instruction: 'assign',
            src: args[i],
            dst: fn.args[i],
        });
    }
    await Run(fn.run);
    for (let item of fn.vars) {
        const addr = item.addr.pop();
        Net.memory.free(addr);
    }
    return ctx.returnValue;
};
