import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'index-acc',
	compile: ({ content }, context) => {
        const { valueType } = TreeCompiler.compile(content, context);
        if (valueType !== 'int') {
            throw new CompilationError(`array subscript is not an integer`, content.startsAt);
        }
	},
});
