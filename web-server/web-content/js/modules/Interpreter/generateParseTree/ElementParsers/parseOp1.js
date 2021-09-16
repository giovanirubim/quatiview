import ParseTreeNode from '../ParseTreeNode.js';

import zeroToMany from './Support/zeroToMany.js';
import oneOf from './Support/oneOf.js';

import parseArgCall from './parseArgCall.js'
import parseIndexAcc from './parseIndexAcc.js'
import parseMemberAcc from './parseMemberAcc.js'
import parseOp0 from './parseOp0.js';

const parseOperation = (tokenGenerator) => oneOf(
    tokenGenerator,
    parseArgCall,
    parseIndexAcc,
    parseMemberAcc,
);

export default (tokenGenerator) => {
    let operand, operations;
    const children = [
        operand = parseOp0(tokenGenerator),
        ... (operations = zeroToMany(tokenGenerator, parseOperation)),
    ];
    if (operations.length === 0) {
        return operand;
    }
	return new ParseTreeNode({
		typeName: 'op1',
        content: { operand, operations },
		children,
	});
};
