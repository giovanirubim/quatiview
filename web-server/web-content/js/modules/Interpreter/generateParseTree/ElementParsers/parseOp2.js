import ParseTreeNode from '../ParseTreeNode.js';
import parseOp1 from './parseOp1.js';
import parseSizeOf from './parseSizeOf.js';

const parseOp2 = (tokenGenerator) => {
    const operator = tokenGenerator.popIfIs(
        'minus',
        'ampersand',
        'asterisk',
    );
    if (operator) {
        let operand = parseOp2(tokenGenerator);
        return new ParseTreeNode({
            typeName: 'op2',
            content: { operand, operator },
            children: [ operand, operator ],
        });
    }
    if (tokenGenerator.nextIs('sizeof')) {
        return parseSizeOf(tokenGenerator);
    }
    return parseOp1(tokenGenerator);
};

export default parseOp2;
