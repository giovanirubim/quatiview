const events = [ 'input', 'step', 'end' ];
const awaitingNext = Object.fromEntries(
	events.map(
		(name) => [name, { done: null, fail: null }],
	),
);
const onAwaitingNextHandler = Object.fromEntries(
	events.map(
		(name) => [name, null],
	),
);
const eventHandler = Object.fromEntries(
	events.map(
		(name) => [name, null],
	),
);

export class AbortionEvent extends Error {}

// Set an action for when an event is waited for
export const onAwaitNext = (name, handler) => {
    onAwaitingNextHandler[name] = handler;
};

// Set an action for when an event happens
export const onEvent = (name, handler) => {
    eventHandler[name] = handler;
};

// Await for next event
export const next = (name) => new Promise((done, fail) => {
    const obj = awaitingNext[name];
    obj.done = done;
    obj.fail = fail;
    onAwaitingNextHandler[name]?.();
});    

// Trigger an event
export const trigger = (name) => {
    awaitingNext[name].done?.();
    awaitingNext[name].done = null;
    awaitingNext[name].fail = null;
    eventHandler[name]?.();
};

// Abort an event that was being waited for
export const abort = (name) => {
	awaitingNext[name].fail?.(new AbortionEvent());
    awaitingNext[name].done = null;
    awaitingNext[name].fail = null;
};
