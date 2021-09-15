import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

const typeToText = ({ typeName, content }, pointerCount) => {
	const pointer = '*'.repeat(pointerCount);
	if (typeName === 'struct-type') {
		return `struct ${content.structName}${pointer}`;
	}
	if (typeName === 'int-type') {
		return content.typeName + pointer;
	}
	throw 'Not know what to do here: ' + typeName;
};

new TreeCompiler({
	nonTerminal: 'fun-dec',
	compile: ({ content }, context) => {
		const { global, local } = context;
		const argSign = [];
		const { type: returnType, name, argList, scope, pointerCount } = content;
		for (let item of argList.content) {
			const { type, pointerCount, isArray, name } = item.content;
			const totalPointerCount = pointerCount + isArray;
			if (argSign.find(arg => arg.name === name)) {
				throw new CompilationError(`Redefinition of parameter '${name}'`);
			}
			const arg = {
				name,
				textType: typeToText(type.content, totalPointerCount),
				pointerCount: totalPointerCount,
			};
			argSign.push(arg);
			local.set(name, arg);
		}
		global.set(name, {
			name,
			type: 'function',
			returnType,
			argSign,
		});
		context.returnType = typeToText(returnType.content, pointerCount);
		TreeCompiler.compile(scope);
		context.returnType = null;
	},
});
