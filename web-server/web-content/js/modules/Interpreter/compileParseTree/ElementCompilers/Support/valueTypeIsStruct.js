export default (valueType) => {
	if (!valueType.includes('struct')) {
		return false;
	}
	if (valueType.includes('*')) {
		return false;
	}
	return true;
};