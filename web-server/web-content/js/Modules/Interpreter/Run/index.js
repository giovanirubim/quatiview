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
import getchar from './Instructions/getchar.js';
import forLoop from './Instructions/for.js';

const map = {
    'call': call,
    'store': store,
    'run': run,
    'load': load,
    'assign': assign,
    'putchar': putchar,
    'sum': sum,
    'div': div,
    'mod': mod,
    'mul': mul,
    'lt': lt,
    'gt': gt,
    'le': le,
    'ge': ge,
    'if': fork,
    'malloc': malloc,
    'free': free,
    'init': init,
    'member': member,
    'ptr-acc': ptrAcc,
    'eq': eq,
    'ret': ret,
    'not': not,
    'getchar': getchar,
    'for': forLoop,
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
