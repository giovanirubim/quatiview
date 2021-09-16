import TreeCompiler from '../TreeCompiler.js';
import Scope from '../Scope.js';
import { CompilationError } from '../../../../errors.js';
import project from '../../../../Project.js';

const getchar = async function* (_, context) {
	context.returnValue = await project.terminal.getchar();
};

new TreeCompiler({
	nonTerminal: 'program',
	compile: ({ content: lines }) => {
		const global = new Scope();
		global.set('getchar', {
			name: 'getchar',
			valueType: 'function',
			returnType: 'char',
			isFunction: true,
			argSign: [],
			scopeId: global.id,
			__override: getchar,
		});
		const globalVars = [];
		const context = {
			global,
			local: global,
			structs: {},
			returnType: null,
			structSign: null,
			varUidMap: {},
			scopeVars: globalVars,
			returnValue: null,
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
		console.log('running program');
		yield* TreeCompiler.execute(main, context);
	},
});
