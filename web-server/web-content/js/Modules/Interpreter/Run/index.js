import call from './instructions/call.js';
import assign from './Instructions/assign.js';

const map = {
    call,
    assign,
};

export default (obj) => {
    return map[obj.instruction](obj);
};
