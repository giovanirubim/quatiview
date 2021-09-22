import call from './Instructions/call.js';
import store from './Instructions/store.js';
import load from './Instructions/load.js';
import run from './Instructions/run.js';
import putchar from './Instructions/putchar.js';
import assign from './Instructions/assign.js';
import sum from './Instructions/sum.js';
import div from './Instructions/div.js';
import mod from './Instructions/mod.js';
import mul from './Instructions/mul.js';
import lt from './Instructions/lt.js';
import gt from './Instructions/gt.js';
import le from './Instructions/le.js';
import ge from './Instructions/ge.js';
import _if from './Instructions/if.js';
import malloc from './Instructions/malloc.js';
import free from './Instructions/free.js';
import init from './Instructions/init.js';

const map = {
    call,
    store,
    run,
    load,
    assign,
    putchar,
    sum,
    div, mod, mul,
    lt, gt, le, ge,
    if: _if,
    malloc,
    free,
    init,
};

export default (obj) => {
    const fn = map[obj.instruction];
    if (!fn) {
        console.error(obj);
        throw new Error(`Undefined method to execute ${obj.instruction}`);
    }
    return fn(obj);
};
