import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'local-line',
	compile: ({ content }, context) => {
        TreeCompiler.compile(content, context);
	},
});
