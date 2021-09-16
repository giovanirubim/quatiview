import TreeCompiler from '../TreeCompiler.js';
import getTypeSize from './Support/getTypeSize.js';
import typeToText from './Support/typeToText.js';

new TreeCompiler({
	nonTerminal: 'var-dec',
	compile: ({ content }, context) => {
		const { local, structSign } = context;
		const type = content.type.content;
		const { items } = content;
		let offset = 0;
		for (let { startsAt, content } of items) {
			const { name, pointerCount, arraySize } = content;
			const totalPointerCount = pointerCount + (arraySize !== null)
			const valueType = typeToText(type, totalPointerCount);
			if (structSign) {
				let size;
				if (arraySize == null) {
					size = getTypeSize(valueType, context, startsAt);
				} else if (pointerCount) {
					size = arraySize*4;
				} else {
					size = getTypeSize(typeToText(type))*arraySize;
				}
				structSign.vars[name] = { name, valueType, size, offset };
				offset += size;
				continue;
			}
			local.set(name, {
				name,
				scopeId: local.id,
				decType: 'variable',
				valueType,
				lValue: true,
			});
		}
	},
});
