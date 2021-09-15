import parseOp2 from './parseOp2.js';
import parseOperation from './parseOperation.js';

export default (tokenGenerator) => parseOperation({
    typeName: 'op3',
    parseOperand: parseOp2,
    operators: [ 'asterisk', 'slash', 'percent' ],
    tokenGenerator,
});
