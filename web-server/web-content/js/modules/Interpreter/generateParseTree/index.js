import TokenGenerator from './TokenGenerator.js';
import tokenSet from '../PatternDefinitions/TokenSet.js';
import parseConstant from './ElementParsers/parseConstant.js';

export default (sourceConsumer) => {
	const tokenGenerator = new TokenGenerator({
		sourceConsumer,
		tokenSet,
	});
	return parseConstant(tokenGenerator);
};
