import ParseTreeNode from '../ParseTreeNode.js';
import parseGlobalLine from './parseGlobalLine.js';
import zeroToMany from './zeroToMany.js';

export default (tokenGenerator) => {
    const lines = zeroToMany(tokenGenerator, parseGlobalLine);
	return new ParseTreeNode({
		typeName: 'program',
        content: lines,
		children: [ ...lines ],
	});
};
