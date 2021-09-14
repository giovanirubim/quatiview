import ParseTreeNode from '../ParseTreeNode.js';
import parseExpr from './parseExpr.js';
import parseScope from './parseScope.js';

export default (tokenGenerator) => {
	let cond, scopeTrue, scopeFalse;
	const children = [
		tokenGenerator.pop('if'),
		tokenGenerator.pop('left-parentheses'),
		cond = parseExpr(tokenGenerator),
		tokenGenerator.pop('right-parentheses'),
		scopeTrue = parseScope(tokenGenerator),
	];
	if (tokenGenerator.nextIs('else')) {
		children.push(
			tokenGenerator.pop('else'),
			scopeFalse = parseScope(tokenGenerator),
		);
	} else {
		scopeFalse = null;
	}
	return new ParseTreeNode({
		typeName: 'if',
        content: { cond, scopeTrue, scopeFalse },
		children,
	});
};
