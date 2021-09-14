import ParseTreeNode from '../ParseTreeNode.js';
import parseExpr from './parseExpr.js';
import parseScope from './parseScope.js';

export default (tokenGenerator) => {
	let cond, scope;
	const children = [
		tokenGenerator.pop('while'),
		tokenGenerator.pop('left-parentheses'),
		cond = parseExpr(tokenGenerator),
		tokenGenerator.pop('right-parentheses'),
		scope = parseScope(tokenGenerator),
	];
	return new ParseTreeNode({
		typeName: 'while',
        content: { cond, scope },
		children,
	});
};
