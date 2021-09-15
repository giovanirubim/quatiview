import SourceConsumer from './SourceConsumer.js';
import generateParseTree from './generateParseTree';
import compileParseTree from './compileParseTree';

export default class Interpreter {
	static compile(sourceCode) {
		const tree = generateParseTree(new SourceConsumer(sourceCode));
		compileParseTree(tree);
		return tree;
	}
}
