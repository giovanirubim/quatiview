import TreeCompiler from '../TreeCompiler.js';
import Scope from '../Scope.js';

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
		};
		for (let line of lines) {
			TreeCompiler.compile(line, context);
		}
	},
	execute: ({ content: lines }, { project }) => {

	},
});
