import Run from '../index.js';
import Net from '../../../Net.js';
import solve from './Support/solve.js';

export default async ({ ctx, args, fn, structAllocation }) => {
    const callstack = ctx.callstack = ctx.callstack ?? [];
    callstack.push(fn.name);
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
    ctx.returned = false;
    for (let item of fn.vars) {
        const addr = item.addr.pop();
        Net.memory.free(addr);
    }
    callstack.pop();
    if (structAllocation != null) {
        const struct = ctx.structs[structAllocation];
        const addr = ctx.returnValue.value;
        const { viewFlag } = struct;
        Net.memViewer.addInstance(viewFlag, addr);
    }
    return ctx.returnValue;
};