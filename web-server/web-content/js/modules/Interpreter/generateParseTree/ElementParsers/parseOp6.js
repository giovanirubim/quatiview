import parseOp5 from "./parseOp5.js";
import parseOperation from "./parseOperation.js";

export default (tokenGenerator) => parseOperation({
    typeName: 'op6',
    operators: [
        'equals',
        'different',
    ],
    parseOperand: parseOp5,
    tokenGenerator,
});
