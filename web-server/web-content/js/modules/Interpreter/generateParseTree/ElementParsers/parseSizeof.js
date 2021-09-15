import ParseTreeNode from '../ParseTreeNode.js';
import parseType from './parseType.js';

export default (tokenGenerator) => {
    let type, asterisks;
    const children = [
        tokenGenerator.pop('sizeof'),
        tokenGenerator.pop('left-parentheses'),
        type = parseType(tokenGenerator),
        ... (asterisks = tokenGenerator.popMany('asterisk')),
        tokenGenerator.pop('right-parentheses'),
    ];
	return new ParseTreeNode({
		typeName: 'sizeof',
        content: {
            type,
            pointerCount: asterisks.length,
        },
		children: children.filter(item => item !== null),
	});
};
