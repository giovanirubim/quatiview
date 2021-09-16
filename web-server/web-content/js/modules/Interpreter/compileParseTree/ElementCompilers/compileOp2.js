import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'op2',
	compile: ({ content }, context) => {
        const { operator, operand } = content;
        const symbol = operator.content;
        const data = TreeCompiler.compile(operand, context);
        const { valueType } = data;
        if (symbol === '*') {
            if (valueType === 'void*') {
                throw new CompilationError(`dereferencing 'void *' pointer`, operand.startsAt);
            }
            if (!valueType.includes('*')) {
                throw new CompilationError(`invalid type argument of unary '*'`, operand.startsAt);
            }
            return {
                valueType: valueType.substr(0, valueType.length - 1),
                lValue: true,
            };
        }
        if (symbol === '-') {
            if (valueType !== 'int') {
                throw new CompilationError(`invalid type argument of unary '-'`, operand.startsAt);
            }
            if (data.value != null) {
                return {
                    valueType,
                    value: - data.value,
                };
            }
            return { valueType };
        }
        if (symbol === '&') {
            if (!data.lValue) {
                throw new CompilationError(`lvalue required as unary '&' operand`, operand.startsAt);
            }
            return { valueType: valueType + '*' };
        }
	},
});
