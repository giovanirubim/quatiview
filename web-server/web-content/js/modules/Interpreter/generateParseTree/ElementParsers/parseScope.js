import ParseTreeNode from '../ParseTreeNode.js';
import parseLocalLine from './parseLocalLine.js';
import zeroToMany from './zeroToMany.js';

export default (tokenGenerator) => {
    const children = [];
    const lines = [];
    children.push(tokenGenerator.pop('left-brackets'));
    while (!tokenGenerator.nextIs('right-brackets')) {
        const line = parseLocalLine(tokenGenerator);
        lines.push(line);
        children.push(line);
    }
    children.push(tokenGenerator.pop('right-brackets'));
	return new ParseTreeNode({
		typeName: 'scope',
        content: lines,
		children,
	});
};
