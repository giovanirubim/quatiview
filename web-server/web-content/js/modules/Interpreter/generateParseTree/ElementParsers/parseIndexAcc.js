import ParseTreeNode from '../ParseTreeNode.js';
import parseExpr from '../parseExpr.js';

export default (tokenGenerator) => {
	const children = [
		tokenGenerator.pop('left-square-brackets'),
		parseExpr(tokenGenerator),
		tokenGenerator.pop('right-square-brackets'),
	];
	return new ParseTreeNode({
		typeName: 'index-acc',
        content: children[1],
		children: [],
	});
};
