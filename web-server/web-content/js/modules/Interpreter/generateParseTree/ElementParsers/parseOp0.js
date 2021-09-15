import ParseTreeNode from '../ParseTreeNode.js';
import parseExpr from './parseExpr.js';
import parseConst from './parseConst.js';

export default (tokenGenerator) => {
    let children, content;
    if (tokenGenerator.nextIs('left-parentheses')) {
        children = [
            tokenGenerator.pop('left-parentheses'),
            content = parseExpr(tokenGenerator),
            tokenGenerator.pop('right-parentheses'),
        ];
    } else if (tokenGenerator.nextIs('id')) {
        children = [
            content = tokenGenerator.pop('id'),
        ];
    } else {
        return parseConst(tokenGenerator);
    }
	return new ParseTreeNode({
		typeName: 'op0',
        content,
		children,
	});
};
