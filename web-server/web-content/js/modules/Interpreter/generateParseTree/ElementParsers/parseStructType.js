import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	const struct = tokenGenerator.pop('struct');
    const id = tokenGenerator.pop('id');
	return new ParseTreeNode({
		typeName: 'struct-type',
		children: [ struct, id ],
		content: { structName: id.content },
	});
};
