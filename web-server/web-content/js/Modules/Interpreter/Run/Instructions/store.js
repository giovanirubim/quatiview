import Net from '../../../Net.js';

export default async ({ src, dst }) => {
    if (dst.type === 'char') {
        if (src.type === 'int' || src.type === 'char') {
            if (src.value != null) {
                Net.memory.write(dst.addr.at(0), src.value & 255);
                return src;
            }
        }
    } else if (dst.type === 'int') {
        if (src.type === 'int' || src.type === 'char') {
            if (src.value != null) {
                Net.memory.writeWord(dst.addr.at(0), src.value);
                return src;
            }
        }
    }
    console.log(src, dst);
    throw new Error('dunno wat TODO');
};
