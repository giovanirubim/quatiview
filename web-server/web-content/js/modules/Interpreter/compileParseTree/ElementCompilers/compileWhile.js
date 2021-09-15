import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import valueTypeIsStruct from './Support/valueTypeIsStruct.js';

new TreeCompiler({
	nonTerminal: 'while',
	compile: ({ content }, context) => {
        const { cond, scope } = content;
        const { valueType } = TreeCompiler.compile(cond, context);
        if (valueTypeIsStruct(valueType)) {
            throw new CompilationError('used struct type value where scalar is required', cond.startsAt);
        }
        TreeCompiler.compile(scope, context);
	},
});
