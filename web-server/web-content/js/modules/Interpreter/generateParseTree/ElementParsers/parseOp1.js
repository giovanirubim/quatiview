import ParseTreeNode from '../ParseTreeNode.js';

import zeroToMany from './zeroToMany.js';
import oneOf from './oneOf.js';

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
    let item, opertaions;
    const children = [
        item = parseOp0(tokenGenerator),
        ... (opertaions = zeroToMany(tokenGenerator, parseOperation)),
    ];
	return new ParseTreeNode({
		typeName: 'op1',
        content: { item, opertaions },
		children,
	});
};
