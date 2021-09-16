const awaitingNext = {
    input: { done: null, fail: null },
    step: { done: null, fail: null },
};
const onAwaitingNextHandler = { input: null, step: null };
const onEventHandler = { input: null, step: null };
let onAbortHandler = null;

export class AbortionEvent extends Error {}

// Set an action for when an event is waited for
export const onAwaitNext = (name, handler) => {
    onAwaitingNextHandler[name] = handler;
};

// Set an action for when an event happens
export const onEvent = (name, handler) => {
    onEventHandler[name] = handler;
};

// Await for next event
export const next = (name) => new Promise((done, fail) => {
    const obj = awaitingNext[name];
    obj.done = done;
    obj.fail = fail;
    onAwaitingNextHandler[name]?.();
});    

// Abort all waiting methods
export const abort = () => {
    const error = new AbortionEvent();
    awaitingNext.input.fail?.(error);
    awaitingNext.input.fail = null;
    awaitingNext.step.fail?.(error);
    awaitingNext.step.fail = null;
    onAbortHandler?.();
    onAbortHandler = null;
};

// Trigger an event
export const trigger = (name) => {
    awaitingNext[name].done?.();
    awaitingNext[name].done = null;
    onEventHandler[name]?.();
};
