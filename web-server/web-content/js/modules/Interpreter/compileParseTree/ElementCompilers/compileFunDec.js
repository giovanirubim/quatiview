import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import typeToText from './Support/typeToText.js';

new TreeCompiler({
	nonTerminal: 'fun-dec',
	compile: ({ content }, context) => {
		const { global, local } = context;
		const argSign = [];
		const { type, name, argList, scope, pointerCount } = content;
		for (let item of argList.content) {
			const { type, pointerCount, isArray, name } = item.content;
			const totalPointerCount = pointerCount + isArray;
			if (argSign.find(arg => arg.name === name)) {
				throw new CompilationError(`Redefinition of parameter '${name}'`);
			}
			const arg = {
				name,
				type: typeToText(type.content, totalPointerCount),
				pointerCount: totalPointerCount,
			};
			argSign.push(arg);
			local.set(name, arg);
		}
		const returnType = typeToText(type.content, pointerCount);
		global.set(name, {
			name,
			decType: 'function',
			valueType: returnType,
			argSign,
		});
		context.returnType = returnType;
		TreeCompiler.compile(scope, context);
		context.returnType = null;
	},
});
