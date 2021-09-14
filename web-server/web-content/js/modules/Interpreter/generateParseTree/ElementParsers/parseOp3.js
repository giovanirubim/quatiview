import ParseTreeNode from '../ParseTreeNode.js';
import parseOp2 from './parseOp2.js';

export default (tokenGenerator) => {
    const item = parseOp2(tokenGenerator);
    let operations = [];
    for (;;) {
        const operator = tokenGenerator.popIfIs(
            'asterisk',
            'slash',
            'percent',
        );
        if (!operator) {
            break;
        }
        operations.push({
            operator,
            operand: parseOp2(tokenGenerator),
        });
    }
    const children = [
        item,
        ... operations.map((item) => [item.operator, item.operand]).flat(),
    ];
	return new ParseTreeNode({
		typeName: 'op3',
        content: { item, operations },
		children,
	});
};
