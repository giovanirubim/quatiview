import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'id',
	compile: ({ content: name, startsAt }, { local }) => {
        const data = local.get(name);
        if (!data) {
            throw new CompilationError(`'${name}' undeclarated`, startsAt);
        }
        return data;
	},
});
