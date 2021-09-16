import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'id',
	compile: (node, { local }) => {
        const { content, startsAt } = node;
        const name = content;
        const data = local.get(name);
        if (!data) {
            throw new CompilationError(`'${name}' undeclarated`, startsAt);
        }
        node.data = data;
        return data;
	},
    execute: async function* () {
        
    },
});
