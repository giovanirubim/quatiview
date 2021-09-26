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
import fork from './Instructions/if.js';
import malloc from './Instructions/malloc.js';
import free from './Instructions/free.js';
import init from './Instructions/init.js';
import member from './Instructions/member.js';
import ptrAcc from './Instructions/ptr-acc.js';
import eq from './Instructions/eq.js';
import ret from './Instructions/ret.js';
import not from './Instructions/not.js';

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
    if: fork,
    malloc,
    free,
    init,
    member,
    'ptr-acc': ptrAcc,
    eq,
    ret,
    not,
};

export default async (obj) => {
    const fn = map[obj.instruction];
    if (!fn) {
        console.error(obj);
        throw new Error(`Undefined method to execute ${obj.instruction}`);
    }
    const res = await fn(obj);
    return res;
};
