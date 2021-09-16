import SourceConsumer from './SourceConsumer.js';
import generateParseTree from './generateParseTree';
import compileParseTree from './compileParseTree';
import TreeCompiler from './compileParseTree/TreeCompiler.js';

export default class Interpreter {
	static compile(sourceCode) {
		const tree = generateParseTree(new SourceConsumer(sourceCode));
		const context = compileParseTree(tree);
		return {
			tree,
			execute: () => TreeCompiler.execute(tree, context),
		};
	}
}
