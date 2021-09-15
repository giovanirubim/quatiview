import TreeCompiler from '../TreeCompiler.js';
import typeToText from './Support/typeToText.js';

new TreeCompiler({
	nonTerminal: 'var-dec',
	compile: ({ content }, { local }) => {
		const type = content.type.content;
		const { items } = content;
		for (let { content } of items) {
			const { name, pointerCount, arraySize } = content;
			const totalPointerCount = pointerCount + (arraySize !== null)
			local.set(name, {
				name,
				scopeId: local.id,
				decType: 'variable',
				valueType: typeToText(type, totalPointerCount),
				lValue: true,
			});
		}
	},
});
