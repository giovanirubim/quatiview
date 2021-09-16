import project from '../../../../../Project.js';

export default (vars) => {
    const { memory } = project;
    for (let varData of vars) {
        memory.free(varData.addr);
        varData.stack.pop();
        varData.addr = varData.stack.at(-1);
    }
};
