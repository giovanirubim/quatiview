import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'op0',
	compile: ({ content }, context) => {
        return TreeCompiler.compile(content, context);
	},
});
