class Abortion extends Error {}

let waitingStep = null;

// export const waitStep = () => {};

export const waitStep = () => new Promise((done, fail) => {
    waitingStep = { done, fail };
});

export const step = () => {
    if (waitingStep === null) {
        return;
    }
    const { done } = waitingStep;
    waitingStep = null;
    done();
};

export const abort = () => {
    const { fail } = waitingStep;
    waitingStep = null;
    fail(new Abortion());
};

export const isAbortion = (error) => error instanceof Abortion;
