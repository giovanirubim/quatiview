export default ({ typeName, content }, pointerCount = 0) => {
	const pointer = '*'.repeat(pointerCount);
	if (typeName === 'struct-type') {
		return `struct ${content.structName}${pointer}`;
	}
	if (typeName === 'int-type' || typeName === 'void-type') {
		return content.typeName + pointer;
	}
	throw 'Not know what to do here: ' + typeName;
};
