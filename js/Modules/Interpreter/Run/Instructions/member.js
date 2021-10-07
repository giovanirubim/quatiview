import solve from './Support/solve.js';

export default async ({ src, type, size, offset }) => {
    src = await solve(src);
    const addr = src.addr.at(-1) + offset;
    return {
        type,
        size,
        addr: [addr],
    };
};
