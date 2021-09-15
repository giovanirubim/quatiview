import parseOp3 from './parseOp3.js';
import parseOperation from './parseOperation.js';

export default (tokenGenerator) => parseOperation({
    typeName: 'op4',
    parseOperand: parseOp3,
    operators: [ 'minus', 'plus' ],
    tokenGenerator,
});
