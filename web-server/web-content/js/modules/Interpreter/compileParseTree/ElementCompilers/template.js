import TreeCompiler from '../TreeCompiler.js';
import { CompilationError } from '../../../../errors.js';

new TreeCompiler({
	nonTerminal: 'name',
	compile: ({ content }, { global, local }) => {
	},
});
