import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import valueTypeIsStruct from './Support/valueTypeIsStruct.js';

new TreeCompiler({
	nonTerminal: 'return',
	compile: ({ content }, context) => {
        
	},
});
