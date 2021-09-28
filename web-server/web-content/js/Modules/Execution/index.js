import Net from '../Net.js';
import { ExecutionAborted } from '../errors.js';

let running = false;
let waitingInput = null;
let waitingStep = null;

export const waitStep = () => new Promise((done, fail) => {
    waitingStep = { done, fail };
});

export const getChar = () => {
    const byte = Net.terminal.popChar();
    if (byte !== null) {
        return byte;
    }
    Net.terminal.enableInput();
    return new Promise((done, fail) => {
        waitingInput = { done, fail };
    });
};

export const handleInput = () => {
    if (waitingInput === null) {
        return;
    }
    const { done } = waitingInput;
    waitingInput = null;
    done(Net.terminal.popChar());
};

export const handleStep = () => {
    if (waitingStep === null) {
        return;
    }
    const { done } = waitingStep;
    waitingStep = null;
    done();
};

export const abort = () => {
    Net.terminal.disableInput();
    const error = new ExecutionAborted();
    if (waitingStep !== null) {
        const { fail } = waitingStep;
        waitingStep = null;
        fail(error);
    }
    if (waitingInput !== null) {
        const { fail } = waitingInput;
        waitingInput = null;
        fail(error);
    }
    running = false;
};
