import ParseTreeNode from '../ParseTreeNode.js';
import parseArgItem from './parseArgItem.js';

// arg_list ::= arg_item (',' arg_item)*

export default (tokenGenerator) => {
	const first = parseArgItem(tokenGenerator);
	const items = [ first ];
	const children = [ first ];
	while (tokenGenerator.nextIs('comma')) {
		children.push(tokenGenerator.pop('comma'));
		const item = parseArgItem(tokenGenerator);
		items.push(item);
		children.push(item);
	}
	return new ParseTreeNode({
		typeName: 'arg-list',
        content: items,
		children: children,
	});
};
