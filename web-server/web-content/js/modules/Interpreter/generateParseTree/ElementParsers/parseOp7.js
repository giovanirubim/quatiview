import parseOp6 from "./parseOp6.js";
import parseOperation from "./parseOperation.js";

export default (tokenGenerator) => parseOperation({
    typeName: 'op7',
    operators: [
        'logical-and',
    ],
    parseOperand: parseOp6,
    tokenGenerator,
});
