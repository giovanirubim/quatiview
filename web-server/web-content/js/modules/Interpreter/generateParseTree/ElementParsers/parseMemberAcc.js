import ParseTreeNode from '../ParseTreeNode.js';

export default (tokenGenerator) => {
	const dot = tokenGenerator.pop('dot');
	const id = tokenGenerator.pop('id');
	return new ParseTreeNode({
		typeName: 'member_acc',
		children: [ dot, id ],
		content: { memberName: id.content },
	});
};
