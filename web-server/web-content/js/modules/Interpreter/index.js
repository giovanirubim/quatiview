import SourceConsumer from './SourceConsumer.js';
import generateParseTree from './generateParseTree';

export default class Interpreter {
	static getParseTree(sourceCode) {
		return generateParseTree(new SourceConsumer(sourceCode));
	}
}
