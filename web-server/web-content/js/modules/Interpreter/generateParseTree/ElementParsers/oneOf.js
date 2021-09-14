import { SyntaticError } from "../../../../errors.js";

export default (context, ...parsers) => {
    const state = context.getState();
    let farthestError = null;
    for (let parser of parsers) {
        try {
            return parser(context);
        } catch(error) {
            if (error instanceof SyntaticError) {
                context.setState(state);
                if (farthestError === null || error.index > farthestError.index) {
                    farthestError = error;
                }
            } else {
                throw error;
            }
        }
    }
    throw farthestError;
};
