const isPtr = (type) => type.endsWith('*');
const isInt = (type) => type === 'int' || type === 'char';
const isIntOrPtr = (type) => isPtr(type) || isInt(type);

export default (dst, src) => {
    if (isIntOrPtr(dst) && isIntOrPtr(src)) {
        return true;
    }
    return dst === src;
};
