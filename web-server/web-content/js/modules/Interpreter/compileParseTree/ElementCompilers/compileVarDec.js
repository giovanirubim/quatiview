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
			let size;
			if (arraySize == null) {
				size = getTypeSize(valueType, context, startsAt);
			} else if (pointerCount) {
				size = arraySize*4;
			} else {
				size = getTypeSize(typeToText(type))*arraySize;
			}
			if (structSign) {
				structSign.vars[name] = { name, valueType, size, offset };
				offset += size;
				continue;
			}
			const uid = local.id + '/' + name;
			const varData = {
				name, size,
				scopeId: local.id,
				uid: local.id + '/' + name,
				decType: 'variable',
				valueType,
				arraySize,
				lValue: true,
			};
			local.set(name, varData);
			context.varUidMap[uid] = varData;
		}
	},
});
