import ParseTreeNode from '../ParseTreeNode.js';
import attempt from './attempt.js';
import parseExpr from './parseExpr.js';

export default (tokenGenerator) => {
	let expr;
	const children = [
		tokenGenerator.pop('return'),
		expr = attempt(tokenGenerator, parseExpr),
		tokenGenerator.pop('semicolon'),
	];
	return new ParseTreeNode({
		typeName: 'return',
        content: expr,
		children: children.filter((item) => item !== null),
	});
};
