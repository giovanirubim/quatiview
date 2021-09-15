import ParseTreeNode from '../ParseTreeNode.js';
import zeroToMany from './Support/zeroToMany.js';

import parseType from './parseType.js';

const parseAsterisk = (tokenGenerator) => tokenGenerator.pop('asterisk');

export default (tokenGenerator) => {
    const type = parseType(tokenGenerator);
    const asterisks = zeroToMany(tokenGenerator, parseAsterisk);
    const id = tokenGenerator.pop('id');
    const children = [ type, ...asterisks, id ];
    let isArray = tokenGenerator.nextIs('left-square-brackets');
    if (isArray) {
        children.push(
            tokenGenerator.pop('left-square-brackets'),
            tokenGenerator.pop('right-square-brackets'),
        );
    }
	return new ParseTreeNode({
		typeName: 'arg-item',
        children,
        content: {
            type,
            name: id.content,
            pointerCount: asterisks.length,
            isArray,
        },
	});
};
