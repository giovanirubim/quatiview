import Net from '../../../Net.js';
import solve from './Support/solve.js';

export default async ({ arg }) => {
    const { value } = await solve(arg);
    Net.memory.free(value);
    Net.memViewer.removeInstance(value);
};
