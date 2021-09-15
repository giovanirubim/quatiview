import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	const content = tokenGenerator.pop(
		'int-const',
		'char-const',
		'str-const',
		'NULL',
	);
	return new ParseTreeNode({
		typeName: 'const',
		children: [ content ],
		content,
	});
};
