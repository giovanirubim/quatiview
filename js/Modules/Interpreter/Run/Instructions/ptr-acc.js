import solve from './Support/solve.js';

export default async ({ type, src }) => {
    src = await solve(src);
    return {
        type,
        addr: [ src.value ],
    };
};
