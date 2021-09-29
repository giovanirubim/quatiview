export const isPtr = (type) => type.endsWith('*');
export const isInt = (type) => type === 'int' || type === 'char';
export const isIntOrPtr = (type) => isPtr(type) || isInt(type);
export const isStruct = (type) => /^struct\s\w+$/.test(type);
export const isAssignable = (dst, src) => {
    if (isIntOrPtr(dst) && isIntOrPtr(src)) {
        return true;
    }
    return dst === src;
};
