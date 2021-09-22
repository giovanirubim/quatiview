import call from './instructions/call.js';
import assign from './Instructions/assign.js';

const map = {
    call,
    assign,
};

export default (obj) => {
    const fn = map[obj.instruction];
    if (!fn) {
        throw `Undefined method to execute ${obj.instruction}`;
    }
    fn(obj);
};
