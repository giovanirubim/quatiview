import project from '../../../../../Project.js';

export default (vars) => {
    const { memory } = project;
    for (let varData of vars) {
        memory.free(varData.addr);
        varData.memStack.pop();
        varData.addr = varData.memStack.at(-1);
    }
};
