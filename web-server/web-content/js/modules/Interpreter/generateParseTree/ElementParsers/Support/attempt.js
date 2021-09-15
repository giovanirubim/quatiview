import { SyntaticError } from "../../../../../errors.js";

export default (context, parser) => {
    const state = context.getState();
    try {
        return parser(context);
    } catch(error) {
        if (error instanceof SyntaticError) {
            context.setState(state);
            return null;
        } else {
            throw error;
        }
    }
};
