import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import getTypeSize from './Support/getTypeSize.js';
import valueTypeIsStruct from './Support/valueTypeIsStruct.js';

new TreeCompiler({
	nonTerminal: 'expr',
	compile: ({ content }, context) => {
        const { operand, operations } = content;
        const array = [ operand, ... operations.map(item => item.operand) ]
            .map((operand) => ({
                operand,
                data: TreeCompiler.compile(operand, context),
            }))
            .reverse();
        const [{ data: { valueType } }] = array;
        const isStruct = valueTypeIsStruct(valueType);
        for (let i=1; i<array.length; ++i) {
            const { operand, data } = array[i];
            if (!data.lValue) {
                throw new CompilationError('lvalue required as left operand of assignment', operand.startsAt);
            }
            if (isStruct !== valueTypeIsStruct(data.valueType)) {
                throw new CompilationError(`Invalid operands for assignment`, operand.startsAt);
            }
        }
        content.array = array;
        return { valueType };
	},
    execute: async function* ({ content }, context) {
        const { array } = content;
        for (let item of array) {
            yield* TreeCompiler.execute(item.operand);
        }
    },
});
