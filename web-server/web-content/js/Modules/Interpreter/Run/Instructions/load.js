import Net from '../../../Net.js';

export default async ({ src }) => {
    if (src.addr) {
        const addr = src.addr.at(-1);
        if (src.type === 'char') {
            return {
                type: 'int',
                value: Net.memory.read(addr),
            };
        }
    }
    throw new Error('Load: dunno wat TODO');
};
