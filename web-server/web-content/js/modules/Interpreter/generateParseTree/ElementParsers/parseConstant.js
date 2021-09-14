import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => new ParseTreeNode({
	typeName: 'const',
	children: [
		tokenGenerator.pop('int-const', 'char-const', 'str-const'),
	],
});
