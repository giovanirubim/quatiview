import Net from '../../../Net.js';

const isInt = (type) => {
    return type === 'int' || type.endsWith('*');
};

export default async ({ src }) => {
    if (src.addr) {
        const addr = src.addr.at(-1);
        if (src.type === 'char') {
            return {
                type: 'int',
                value: Net.memory.read(addr),
            };
        }
        if (isInt(src.type)) {
            return {
                type: src.type,
                value: Net.memory.readWord(addr),
            };
        }
    }
    throw new Error('Load: dunno wat TODO');
};
