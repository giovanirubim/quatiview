import { CompilationError } from "../../../../../errors.js";

export default (valueType, context, errorIndex) => {
    if (valueType.includes('*')) {
        return 4;
    }
    if (valueType === 'char') {
        return 1;
    }
    if (!valueType.includes('struct')) {
        return 4;
    }
    const [, name ] = valueType.split(' ');
    const size = context.structs[name]?.size;
    if (size == null) {
        throw new CompilationError(`storage size of '${valueType}' isn't known`, errorIndex);
    }
    return size;
};
