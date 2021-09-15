import TreeCompiler from '../TreeCompiler.js';
import typeToText from './Support/typeToText.js';
import getTypeSize from './Support/getTypeSize.js';

new TreeCompiler({
	nonTerminal: 'sizeof',
	compile: ({ content }, context) => {
		const { type, pointerCount } = content;
		const valueType = typeToText(type.content, pointerCount);
		const size = getTypeSize(valueType, context, type.startsAt);
		return {
			valueType,
			value: Number(size),
		};
	},
});
