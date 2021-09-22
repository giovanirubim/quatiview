import Net from '../../../Net.js';

const isIntNumber = (type) => {
    return type === 'int' || type === 'char' || type.endsWith('*');
};

export default async ({ src, dst }) => {
    if (isIntNumber(dst.type)) {
        if (dst.type === 'char') {
            Net.memory.write(dst.addr.at(-1), src.value & 255);
        } else {
            Net.memory.writeWord(dst.addr.at(-1), src.value);
        }
        return src;
    }
    throw new Error('dunno wat TODO');
};
