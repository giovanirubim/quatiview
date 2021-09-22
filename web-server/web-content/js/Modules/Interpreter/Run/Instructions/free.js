import Net from '../../../Net.js';
import Run from '../';

export default async ({ addr }) => {
    const { value } = await Run(addr);
    Net.memory.free(value);
};
