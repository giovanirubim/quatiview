import Net from '../../../Net.js';

export default async ({ ctx }) => {
    const byte = await Net.execution.getChar();
    ctx.returnValue = {
        type: 'int',
        value: byte,
    };
};
