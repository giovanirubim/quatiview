import ParseTreeNode from '../ParseTreeNode.js';
import zeroToMany from './zeroToMany.js';
import oneOf from './oneOf.js';

export default (tokenGenerator) => {
	return new ParseTreeNode({
		typeName: '',
        content: null,
		children: [],
	});
};
