import putchar from './Functions/putchar.js';

const addMalloc = (ctx) => {
    const arg = { name: 'size', type: 'int', size: 4, addr: [] };
    const size = { instruction: 'load', src: arg };
    const data = {
        name: 'malloc',
        type: 'void(*)(int)',
        returnType: 'void',
        argTypes: ['int'], vars: [arg], args: [arg],
        run: { instruction: 'malloc', size, ctx },
    };
    ctx.global.set({ 'malloc': data });
};

const addFree = (ctx) => {
    const arg = { name: 'addr', type: 'void*', size: 4, addr: [] };
    const addr = { instruction: 'load', src: arg };
    const data = {
        name: 'free',
        type: 'void(*)(void*)',
        returnType: 'void',
        argTypes: ['void*'], vars: [arg], args: [arg],
        run: { instruction: 'free', addr, ctx },
    };
    ctx.global.set({ 'free': data });
};

const addFunction = (ctx, { name, returnType, args, run }) => {
    const fn = {
        name,
        type: `${returnType}`,
        returnType,
        argTypes: args.map((arg) => arg.type),
        args,
        vars: args,
        run: { ...run, ctx },
    };
    ctx.global.set({ [name]: fn });
};

export default (ctx) => {
    addFunction(ctx, putchar);
    addMalloc(ctx);
    addFree(ctx);
};
