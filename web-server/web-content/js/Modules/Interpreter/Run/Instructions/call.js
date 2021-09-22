import Run from '../';
import Net from '../../../Net.js';
import solve from './solve.js';

export default async ({ ctx, args, fn }) => {
    const values = [];
    for (let arg of args) {
        const value = await solve(arg);
        values.push(value);
    }
    for (let item of fn.vars) {
        const addr = Net.memory.allocate(item.size);
        item.addr.push(addr);
    }
    for (let i=0; i<args.length; ++i) {
        await Run({
            instruction: 'assign',
            src: values[i],
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
