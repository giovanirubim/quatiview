import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	const content = tokenGenerator.pop('char', 'int');
	return new ParseTreeNode({
		typeName: 'int_type',
		content,
		children: [ content ],
	});
};
