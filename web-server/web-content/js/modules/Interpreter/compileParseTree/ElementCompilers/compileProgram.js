import TreeCompiler from '../TreeCompiler.js';
import Scope from '../Scope.js';
import { CompilationError } from '../../../../errors.js';

new TreeCompiler({
	nonTerminal: 'program',
	compile: ({ content: lines }) => {
		const global = new Scope();
		const context = {
			global,
			local: global,
			returnType: null,
			structs: {},
			structSign: null,
			varUidMap: {},
		};
		for (let line of lines) {
			TreeCompiler.compile(line, context);
		}
		const main = global.items.main;
		if (!main) {
			throw new CompilationError('main function was not declared');
		}
		console.log(context.varUidMap);
	},
	execute: ({ content: lines }) => {
	},
});
