import TokenGenerator from './TokenGenerator.js';
import tokenSet from '../PatternDefinitions/TokenSet.js';
import parseMemberAcc from './ElementParsers/parseMemberAcc.js';

export default (sourceConsumer) => {
	const tokenGenerator = new TokenGenerator({
		sourceConsumer,
		tokenSet,
	});
	return parseMemberAcc(tokenGenerator);
};
