import TreeCompiler from '../TreeCompiler.js';
import Scope from '../Scope.js';
import { CompilationError } from '../../../../errors.js';

const allocate = 

new TreeCompiler({
	nonTerminal: 'program',
	compile: ({ content: lines }) => {
		const global = new Scope();
		const globalVars = [];
		const context = {
			global,
			local: global,
			structs: {},
			returnType: null,
			structSign: null,
			varUidMap: {},
			scopeVars: globalVars,
		};
		for (let line of lines) {
			TreeCompiler.compile(line, context);
		}
		const main = global.items.main;
		if (!main) {
			throw new CompilationError('main function was not declared');
		}
		return context;
	},
	execute: async function* ({ content: lines }, context) {
		const { global } = context;
		const main = global.items.main.node;
		TreeCompiler.execute(main);
	},
});
