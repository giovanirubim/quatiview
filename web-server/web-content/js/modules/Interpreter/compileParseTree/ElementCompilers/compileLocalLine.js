import TreeCompiler from '../TreeCompiler.js';
import project from '../../../../Project.js';

new TreeCompiler({
	nonTerminal: 'local-line',
	compile: ({ content }, context) => {
        TreeCompiler.compile(content, context);
	},
	execute: async function* ({ content, startsAt, endsAt }, context) {
		console.log({ startsAt, endsAt });
		project.editor.highlight(startsAt, endsAt);
		yield* TreeCompiler.execute(content);
		yield;
	},
});
