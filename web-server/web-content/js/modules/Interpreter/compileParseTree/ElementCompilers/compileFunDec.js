import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import addStackFor from './Support/addStackFor.js';
import getTypeSize from './Support/getTypeSize.js';
import popStackOf from './Support/popStackOf.js';
import typeToText from './Support/typeToText.js';
import valueTypeIsStruct from './Support/valueTypeIsStruct.js';

new TreeCompiler({
	nonTerminal: 'fun-dec',
	compile: (node, context) => {
		const { content } = node;
		const { global } = context;
		const args = [];
		const { type, name, argList, scope, pointerCount } = content;
		context.local = context.local.stack();
		const items = argList?.content ?? [];
		const { local } = context;
		for (let item of items) {
			const { type, pointerCount, isArray, name } = item.content;
			const totalPointerCount = pointerCount + isArray;
			if (args.find(arg => arg.name === name)) {
				throw new CompilationError(`Redefinition of parameter '${name}'`);
			}
			const valueType = typeToText(type.content, totalPointerCount);
			const arg = {
				name,
				size: getTypeSize(valueType),
				scopeId: local.id,
				uid: local.id + '/' + name,
				decType: 'variable',
				valueType,
				lValue: true,
				memStack: [],
				addr: null,
			};
			args.push(arg);
			context.local.set(name, arg);
		}
		const returnType = typeToText(type.content, pointerCount);
		global.set(name, {
			name,
			node,
			valueType: 'function',
			returnType,
			isFunction: true,
			argSign: args,
			scopeId: global.id,
		});
		content.args = args;
		context.returnType = returnType;
		TreeCompiler.compile(scope, context);
		context.local = context.local.parent;
		context.returnType = null;
	},
	execute: ({ content }, context) => {
		const { args, scope } = content;
		addStackFor(args);
		popStackOf(args);
	},
});
