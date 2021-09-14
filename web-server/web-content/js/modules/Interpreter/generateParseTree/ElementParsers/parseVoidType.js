import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	const content = tokenGenerator.pop('void');
	return new ParseTreeNode({
		typeName: 'void_type',
        content,
		children: [ content ],
	});
};
