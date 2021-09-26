import Net from '../../../Net.js';

export default async ({ ctx }) => {
    const byte = await Net.terminal.getchar();
    ctx.returnValue = {
        type: 'int',
        value: byte,
    };
};
