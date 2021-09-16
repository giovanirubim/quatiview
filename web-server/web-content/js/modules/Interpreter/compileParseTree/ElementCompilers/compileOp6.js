import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import valueTypeIsStruct from './Support/valueTypeIsStruct.js';

new TreeCompiler({
	nonTerminal: 'op6',
	compile: ({ content }, context) => {
		const { operand, operations } = content;
		const data = TreeCompiler.compile(operand, context);
		if (valueTypeIsStruct(data.valueType) || data.valueType === 'function') {
			const [{ operator }] = operations;
			throw new CompilationError(
				`Invalid operands for ${operator.content} at ${operator.startsAt}`,
				operator.startsAt,
			);
		}
		for (let { operator, operand } of operations) {
			const data = TreeCompiler.compile(operand, context);
			if (!valueTypeIsStruct(data.valueType) && data.valueType !== 'function') {
				continue;
			}
			throw new CompilationError(
				`Invalid operands for ${operator.content} at ${operator.startsAt}`,
				operator.startsAt,
			);
		}
		return { valueType: 'int' };
	},
});
