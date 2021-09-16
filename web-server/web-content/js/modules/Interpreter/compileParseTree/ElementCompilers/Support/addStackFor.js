import project from '../../../../../Project.js';

export default (vars) => {
    const { memory } = project;
    for (let varData of vars) {
        const addr = memory.allocate(varData.size);
        varData.stack.push(addr);
        varData.addr = addr;
    }
};
