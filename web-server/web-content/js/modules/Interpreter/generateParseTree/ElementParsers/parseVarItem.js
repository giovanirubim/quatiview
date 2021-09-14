import ParseTreeNode from '../ParseTreeNode.js';
import zeroToMany from './zeroToMany.js';
import oneOf from './oneOf.js';

const parseAsterisk = (tokenGenerator) => tokenGenerator.pop('asterisk');

export default (tokenGenerator) => {
    const asterisks = zeroToMany(tokenGenerator, parseAsterisk);
    const id = tokenGenerator.pop('id');
    const children = [
        ... asterisks,
        id,
    ];
    let arraySize = null;
    if (tokenGenerator.nextIs('left-square-brackets')) {
        children.push(tokenGenerator.pop('left-square-brackets'));
        const size = tokenGenerator.pop('int-const');
        children.push(size);
        arraySize = Number(size.content);
        children.push(tokenGenerator.pop('right-square-brackets'));
    }
	return new ParseTreeNode({
		typeName: '',
        content: {
            name: id.content,
            pointerCount: asterisks.length,
            arraySize,
        },
		children,
	});
};
