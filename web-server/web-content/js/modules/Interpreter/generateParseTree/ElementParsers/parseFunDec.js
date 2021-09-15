import ParseTreeNode from '../ParseTreeNode.js';

import attempt from './Support/attempt.js';

import parseArgList from './parseArgList.js';
import parseType from './parseType.js';
import parseScope from './parseScope.js';

export default (tokenGenerator) => {
    let type, asterisks, id, argList, scope;
    const children = [
        type = parseType(tokenGenerator),
        ... (asterisks = tokenGenerator.popMany('asterisk')),
        id = tokenGenerator.pop('id'),
        tokenGenerator.pop('left-parentheses'),
        argList = attempt(tokenGenerator, parseArgList),
        tokenGenerator.pop('right-parentheses'),
        scope = parseScope(tokenGenerator),
    ];
	return new ParseTreeNode({
		typeName: 'fun-dec',
        content: {
            type,
            name: id.content,
            argList,
            scope,
        },
		children: children.filter((item) => item !== null),
	});
};
