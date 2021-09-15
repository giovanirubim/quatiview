import TreeCompiler from '../TreeCompiler.js';
import Scope from '../Scope.js';

new TreeCompiler({
	nonTerminal: 'program',
	compile: ({ content: lines }) => {
		const globalScope = new Scope();
		const context = {
			global: globalScope,
			local: new Scope(globalScope),
			returnType: null,
		};
		for (let line of lines) {
			TreeCompiler.compile(line, context);
		}
	},
});
