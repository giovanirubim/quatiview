import parseOp8 from "./parseOp8.js";
import parseOperation from "./parseOperation.js";

export default (tokenGenerator) => parseOperation({
    typeName: 'expr',
    operators: [ 'assign' ],
    parseOperand: parseOp8,
    tokenGenerator,
});
