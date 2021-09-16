import project from '../../../../Project.js';
import TreeCompiler from '../TreeCompiler.js';
import addStackFor from './Support/addStackFor.js';
import popStackOf from './Support/popStackOf.js';

new TreeCompiler({
	nonTerminal: 'scope',
	compile: ({ content }, context) => {
        context.local = context.local.stack();
        const prevScopeVars = context.scopeVars;
        content.vars = context.scopeVars = [];
        for (let line of content) {
            TreeCompiler.compile(line, context);
        }
        context.scopeVars = prevScopeVars;
        context.local = context.local.parent;
	},
    execute: async function* ({ content }, context) {
        const { vars } = content;
        addStackFor(vars);
        for (let line of content) {
            yield* TreeCompiler.execute(line, context);
        }
        popStackOf(vars);
    },
});
