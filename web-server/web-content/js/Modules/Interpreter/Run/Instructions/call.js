import Run from '../';
import Net from '../../../Net.js';
import solve from './Support/solve.js';

export default async ({ ctx, args, fn }) => {
    log(`<${fn.name}-call>`);
    const callstack = ctx.callstack = ctx.callstack ?? [];
    callstack.push(fn.name);
    const values = [];
    for (let arg of args) {
        const value = await solve(arg);
        values.push(value);
    }
    log(`allocating vars of ${fn.name}`);
    for (let item of fn.vars) {
        const addr = Net.memory.allocate(item.size);
        log(`${item.name}: +${addr} (${item.size})`);
        item.addr.push(addr);
    }
    for (let i=0; i<args.length; ++i) {
        await Run({
            instruction: 'assign',
            src: values[i],
            dst: fn.args[i],
        });
    }
    log(`<${fn.name}-scope>`);
    await Run(fn.run);
    log(`</${fn.name}-scope>`);
    ctx.returned = false;
    log(`freeing vars of ${fn.name}`);
    for (let item of fn.vars) {
        const addr = item.addr.pop();
        log(`${item.name}: -${addr}`);
        Net.memory.free(addr);
    }
    callstack.pop();
    log(`</${fn.name}-call>`);
    return ctx.returnValue;
};
