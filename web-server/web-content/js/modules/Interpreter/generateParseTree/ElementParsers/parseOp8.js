import parseOp7 from "./parseOp7.js";
import parseOperation from "./parseOperation.js";

export default (tokenGenerator) => parseOperation({
    typeName: 'op8',
    operators: [
        'logical-or',
    ],
    parseOperand: parseOp7,
    tokenGenerator,
});
