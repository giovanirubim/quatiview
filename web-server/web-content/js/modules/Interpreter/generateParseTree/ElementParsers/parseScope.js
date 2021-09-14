import ParseTreeNode from '../ParseTreeNode.js';
import parseLocalLine from './parseLocalLine.js';
import zeroToMany from './zeroToMany.js';

export default (tokenGenerator) => {
    let lines;
    const children = [
        tokenGenerator.pop('left-brackets'),
        ... (lines = zeroToMany(tokenGenerator, parseLocalLine)),
        tokenGenerator.pop('right-brackets'),
    ];
	return new ParseTreeNode({
		typeName: 'scope',
        content: lines,
		children,
	});
};
