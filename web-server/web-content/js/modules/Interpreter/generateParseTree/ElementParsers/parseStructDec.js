import ParseTreeNode from '../ParseTreeNode.js';
import oneToMany from './Support/oneToMany.js';

import parseStructType from './parseStructType.js';
import parseVarDec from './parseVarDec.js';

export default (tokenGenerator) => {
    const type = parseStructType(tokenGenerator);
    const children = [
        type,
        tokenGenerator.pop('left-brackets'),
    ];
    const vars = oneToMany(tokenGenerator, parseVarDec);
    children.push(tokenGenerator.pop('right-brackets'));
    children.push(tokenGenerator.pop('semicolon'));
	return new ParseTreeNode({
		typeName: 'struct-dec',
        content: {
            type,
            vars,
        },
		children,
	});
};
