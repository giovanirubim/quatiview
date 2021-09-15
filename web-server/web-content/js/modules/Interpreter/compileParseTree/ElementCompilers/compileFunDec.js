import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import typeToText from './Support/typeToText.js';

new TreeCompiler({
	nonTerminal: 'fun-dec',
	compile: ({ content }, context) => {
		const { global } = context;
		const argSign = [];
		const { type, name, argList, scope, pointerCount } = content;
		context.local = context.local.stack();
		const items = argList?.content ?? [];
		for (let item of items) {
			const { type, pointerCount, isArray, name } = item.content;
			const totalPointerCount = pointerCount + isArray;
			if (argSign.find(arg => arg.name === name)) {
				throw new CompilationError(`Redefinition of parameter '${name}'`);
			}
			const arg = {
				name,
				valueType: typeToText(type.content, totalPointerCount),
				lValue: true,
				scopeId: context.local.id,
			};
			argSign.push(arg);
			context.local.set(name, arg);
		}
		const returnType = typeToText(type.content, pointerCount);
		global.set(name, {
			name,
			valueType: returnType,
			isFunction: true,
			argSign,
			scopeId: global.id,
		});
		context.returnType = returnType;
		TreeCompiler.compile(scope, context);
		context.local = context.local.parent;
		context.returnType = null;
	},
});
