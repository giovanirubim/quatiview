import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import valueTypeIsStruct from './Support/valueTypeIsStruct.js';

const compileFnCall = (data, operation, context) => {
	if (data.valueType !== 'function') {
		throw new CompilationError('called object is not a function', operation.startsAt);
	}
	const args = operation.content.map((arg) => {
		const { valueType } = TreeCompiler.compile(arg, context);
		return { startsAt: arg.startsAt, valueType };
	});
	const fn = context.global.get(data.name);
	const { argSign } = fn;
	if (args.length > argSign.length) {
		throw new CompilationError(`too many arguments to function '${fn.name}'`, operation.startsAt);
	}
	if (args.length < argSign.length) {
		throw new CompilationError(`too few arguments to function '${fn.name}'`, operation.startsAt);
	}
	for (let i=0; i<args.length; ++i) {
		const a = args[i];
		const b = argSign[i];
		if (a.valueType === b.valueType) {
			continue;
		}
		if (a.valueType === 'int' && b.valueType === 'char') {
			continue;
		}
		throw new CompilationError(`incompatible type for argument ${i + 1} of '${fn.name}'`, a.startsAt);
	}
	return { valueType: fn.returnType };
};

const compileIndexAcc = (data, operation, context) => {
	if (!data.valueType.includes('*')) {
		throw new CompilationError(`subscripted value is neither array nor pointer`, operation.startsAt);
	}
	if (data.valueType === 'void*') {
		throw new CompilationError(`dereferencing 'void *' pointer`, operation.startsAt);
	}
	TreeCompiler.compile(operation, context);
	const { valueType } = data;
	return { valueType: valueType.substr(0, valueType.length - 1) };
};

const compileMemberAcc = (data, operation, context) => {
	const name = operation.content.memberName;
	if (!valueTypeIsStruct(data.valueType)) {
		throw new CompilationError(`request for member '${name}' in something not a structure`, operation.startsAt);
	}
	const structName = data.valueType.split(' ')[1];
	const varData = context.structs[structName].vars[name];
	if (!varData) {
		throw new CompilationError(`'${data.valueType}' has no member named '${name}'`);
	}
	return {
		valueType: varData.valueType,
		lValue: true,
	};
};

new TreeCompiler({
	nonTerminal: 'op1',
	compile: ({ content }, context) => {
        const { operand, operations } = content;
        let data = TreeCompiler.compile(operand, context);
		for (let operation of operations) {
			const { typeName } = operation;
			if (typeName === 'arg-call') {
				data = compileFnCall(data, operation, context);
			} else if (typeName === 'index-acc') {
				data = compileIndexAcc(data, operation, context);
			} else if (typeName === 'member-acc') {
				data = compileMemberAcc(data, operation, context);
			}
		}
		return data;
	},
});
