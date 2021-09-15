import ParseTreeNode from '../ParseTreeNode.js';

import parseVarDec from './parseVarDec.js';
import parseWhile from './parseWhile.js';
import parseIf from './parseIf.js';
import parseFor from './parseFor.js';
import parseExpr from './parseExpr.js';
import parseReturn from './parseReturn.js';

import attempt from './attempt.js';
import oneOf from './oneOf.js';

export default (tokenGenerator) => {
    const children = [];
    let content = attempt(tokenGenerator, parseExpr);
    if (content) {
        children.push(
            content,
            tokenGenerator.pop('semicolon'),
        );
    } else {
        content = oneOf(
            tokenGenerator,
            parseVarDec,
            parseWhile,
            parseFor,
            parseIf,
            parseReturn,
        );
        children.push(content);
    }
	return new ParseTreeNode({
		typeName: 'local-line',
        content,
		children,
	});
};
