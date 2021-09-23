import Run from '../';
import Net from '../../../Net.js';
import solve from './Support/solve.js';

export default async ({ ctx, args, fn }) => {
    const values = [];
    for (let arg of args) {
        const value = await solve(arg);
        values.push(value);
    }
    console.log(`allocating vars of ${fn.name}`);
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
    console.log(`running ${fn.name}`);
    await Run(fn.run);
    ctx.returned = false;
    console.log(`freeing vars of ${fn.name}`);
    for (let item of fn.vars) {
        const addr = item.addr.pop();
        Net.memory.free(addr);
    }
    return ctx.returnValue;
};
