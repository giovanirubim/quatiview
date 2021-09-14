import { SyntaticError } from "../../../../errors.js";

export default (context, parser) => {
    const array = [ parser(context) ];
    for (;;) {
        const state = context.getState();
        try {
            array.push(parser(context));
        } catch(error) {
            if (error instanceof SyntaticError) {
                context.setState(state);
                return array;
            }
            throw error;
        }
    }
};
