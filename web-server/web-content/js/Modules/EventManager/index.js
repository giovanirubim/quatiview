class Abortion extends Error {}

const waitingMap = {};
const awaitHandlerMap = {};
const eventHandlerMap = {};

export const on = (name, handler) => {
    eventHandlerMap[name] = handler;
};

export const onawait = (name, handler) => {
    awaitHandlerMap[name] = handler;
};

export const wait = (name) => new Promise((done, fail) => {
    waitingMap[name] = { done, fail };
    awaitHandlerMap[name]?.();
});

export const abort = (name) => {
    const fail = waitingMap[name]?.fail;
    waitingMap[name] = null;
    fail?.(new Abortion());
};

export const trigger = (name) => {
    const done = waitingMap[name]?.done;
    waitingMap[name] = null;
    done();
    eventHandlerMap[name]?.();
};

export const isAbortion = (error) => error instanceof Abortion;
