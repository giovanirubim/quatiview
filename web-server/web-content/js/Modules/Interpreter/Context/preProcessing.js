import malloc from './Functions/malloc.js';
import free from './Functions/free.js';
import getchar from './Functions/getchar.js';
import putchar from './Functions/putchar.js';

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
    addFunction(ctx, malloc);
    addFunction(ctx, free);
    addFunction(ctx, getchar);
    addFunction(ctx, putchar);
};
