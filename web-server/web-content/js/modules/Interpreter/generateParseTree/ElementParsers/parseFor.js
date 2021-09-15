import ParseTreeNode from '../ParseTreeNode.js';
import parseExpr from './parseExpr.js';
import attempt from './Support/attempt.js';
import parseScope from './parseScope.js';

export default (tokenGenerator) => {
	let init, cond, inc, scope;
	const children = [
		tokenGenerator.pop('for'),
		tokenGenerator.pop('left-parentheses'),
		init = attempt(tokenGenerator, parseExpr),
		tokenGenerator.pop('semicolon'),
		cond = attempt(tokenGenerator, parseExpr),
		tokenGenerator.pop('semicolon'),
		inc = attempt(tokenGenerator, parseExpr),
		tokenGenerator.pop('right-parentheses'),
		scope = parseScope(tokenGenerator),
	];
	return new ParseTreeNode({
		typeName: 'for',
        content: { init, cond, inc, scope },
		children: children.filter((item) => item !== null),
	});
};
