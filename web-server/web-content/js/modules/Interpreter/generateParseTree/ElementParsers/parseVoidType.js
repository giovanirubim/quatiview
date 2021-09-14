import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	const content = tokenGenerator.pop('void');
	return new ParseTreeNode({
		typeName: 'void-type',
        content,
		children: [ content ],
	});
};
