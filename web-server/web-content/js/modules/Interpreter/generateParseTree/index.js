import TokenGenerator from './TokenGenerator.js';
import tokenSet from '../PatternDefinitions/TokenSet.js';
import parseProgram from './ElementParsers/parseProgram.js';

export default (sourceConsumer) => {
	const tokenGenerator = new TokenGenerator({
		sourceConsumer,
		tokenSet,
	});
	return parseProgram(tokenGenerator);
};
