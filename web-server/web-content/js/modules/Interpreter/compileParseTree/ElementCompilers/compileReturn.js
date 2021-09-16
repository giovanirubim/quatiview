import { CompilationError } from '../../../../errors.js';
import { start } from '../../../MemViewer/index.js';
import TreeCompiler from '../TreeCompiler.js';
import typeToText from './Support/typeToText.js';
import valueTypeCanBePointer from './Support/valueTypeCanBePointer.js';

new TreeCompiler({
	nonTerminal: 'return',
	compile: ({ content, startsAt }, context) => {
		const { returnType } = context;
		const valueType = content ? TreeCompiler.compile(content, context).valueType : 'void';
		if (valueTypeCanBePointer(valueType) && valueTypeCanBePointer(returnType)) {
			return;
		}
        if (valueType != returnType) {
			throw new CompilationError(
				`incompatible types when returning type '${valueType}' but '${returnType}' was expected`,
				startsAt,
			);
		}
	},
});
