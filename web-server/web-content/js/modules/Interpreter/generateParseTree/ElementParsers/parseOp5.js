import parseOp4 from "./parseOp4.js";
import parseOperation from "./parseOperation.js";

export default (tokenGenerator) => parseOperation({
    typeName: 'op5',
    operators: [
        'less-or-equal',
        'greater-or-equal',
        'less',
        'greater',
    ],
    parseOperand: parseOp4,
    tokenGenerator,
});
