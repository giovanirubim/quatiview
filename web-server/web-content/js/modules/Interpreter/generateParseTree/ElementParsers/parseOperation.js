import ParseTreeNode from "../ParseTreeNode.js";

export default ({
    typeName,
    parseOperand,
    operators,
    tokenGenerator,
}) => {
    const operand = parseOperand(tokenGenerator);
    const operations = [];
    for (;;) {
        const operator = tokenGenerator.popIfIs(...operators);
        if (!operator) {
            break;
        }
        operations.push({
            operator,
            operand: parseOperand(tokenGenerator),
        });
    }
    if (operations.length === 0) {
        return operand;
    }
    const children = [
        operand,
        ... operations.map(({ operator, operand }) => [ operator, operand ]).flat(),
    ];
    return new ParseTreeNode({
        typeName,
        content: { operand, operations },
        children,
    });
};
