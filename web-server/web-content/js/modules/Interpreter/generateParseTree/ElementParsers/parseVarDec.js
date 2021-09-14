import ParseTreeNode from '../ParseTreeNode.js';
import parseType from './parseType.js';
import parseVarItem from './parseVarItem.js';

// var_dec ::= type var_item (',' var_item)* ';'

export default (tokenGenerator) => {
    const type = parseType(tokenGenerator);
    const items = [ parseVarItem(tokenGenerator) ];
    const children = [
        type,
        ... items,
    ];
    while (tokenGenerator.nextIs('comma')) {
        children.push(tokenGenerator.pop('comma'));
        const item = parseVarItem(tokenGenerator);
        children.push(item);
        items.push(item);
    }
    children.push(tokenGenerator.pop('semicolon'));
	return new ParseTreeNode({
		typeName: 'var-dec',
        content: {
            type,
            items,
        },
		children,
	});
};
