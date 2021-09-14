import ParseTreeNode from '../ParseTreeNode.js';
import parseType from './parseType.js';
import parseOp1 from './parseOp1.js';

const parseOp2 = (tokenGenerator) => {
    const operator = tokenGenerator.popIfIs(
        'minus',
        'ampersand',
        'asterisk',
    );
    if (operator) {
        let item = parseOp2(tokenGenerator);
        return new ParseTreeNode({
            typeName: 'op2',
            content: { item, operator },
            children: [ item, operator ],
        });
    }
    if (tokenGenerator.nextIs('sizeof')) {
        let asterisks, type;
        const children = [
            tokenGenerator.pop('sizeof'),
            tokenGenerator.pop('left-parentheses'),
            ... (asterisks = tokenGenerator.popMany('asterisk')),
            type = parseType(tokenGenerator),
            tokenGenerator.pop('right-parentheses'),
        ];
        return new ParseTreeNode({
            typeName: 'op2',
            content: {
                pointerCount: asterisks.length,
                type,
            },
            children,
        });
    }
    let item = parseOp1(tokenGenerator);
    return new ParseTreeNode({
        typeName: 'op2',
        content: { item },
        children: [ item ],
    });
};

export default parseOp2;
