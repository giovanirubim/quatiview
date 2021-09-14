import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	return new ParseTreeNode({
		typeName: '',
        content: null,
		children: [],
	});
};
