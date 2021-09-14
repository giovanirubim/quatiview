import ParseTreeNode from '../ParseTreeNode.js';
import oneOf from './oneOf.js';

import parseIntType from './parseIntType.js';
import parseStructType from './parseStructType.js';
import parseVoidType from './parseVoidType.js';

export default (tokenGenerator) => {
    const content = oneOf(tokenGenerator, parseIntType, parseStructType, parseVoidType);
	return new ParseTreeNode({
		typeName: 'type',
        content,
		children: [ content ],
	});
};
