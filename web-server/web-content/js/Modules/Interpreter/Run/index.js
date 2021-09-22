import call from './Instructions/call.js';
import store from './Instructions/store.js';
import load from './Instructions/load.js';
import run from './Instructions/run.js';
import putchar from './Instructions/putchar.js';
import assign from './Instructions/assign.js';

const map = {
    call,
    store,
    run,
    load,
    assign,
    putchar,
};

export default (obj) => {
    const fn = map[obj.instruction];
    if (!fn) {
        console.error(obj);
        throw new Error(`Undefined method to execute ${obj.instruction}`);
    }
    return fn(obj);
};
