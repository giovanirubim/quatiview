import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'scope',
	compile: ({ content }, context) => {
        context.local = context.local.stack();
        for (let line of content) {
            TreeCompiler.compile(line, context);
        }
        context.local = context.local.parent;
	},
});
