import SourceConsumer from './SourceConsumer.js';
import generateParseTree from './generateParseTree';

export default (sourceCode) => {
	const sourceConsumer = new SourceConsumer(sourceCode);
	return generateParseTree(sourceConsumer);
}
