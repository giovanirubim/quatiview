import ParseTreeNode from '../ParseTreeNode.js';
import parseExpr from './parseExpr.js';

export default (tokenGenerator) => {
    const children = [
        tokenGenerator.pop('left-parentheses'),
    ];
    const items = [];
    const consumeItem = () => {
        const item = parseExpr(tokenGenerator);
        items.push(item);
        children.push(item);
    };
    if (!tokenGenerator.nextIs('right-parentheses')) {
        consumeItem();
        while (tokenGenerator.nextIs('comma')) {
            children.push(tokenGenerator.pop('comma'));
            consumeItem();
        }
    }
    tokenGenerator.pop('right-parentheses');
	return new ParseTreeNode({
		typeName: 'arg-call',
        content: items,
		children,
	});
};
