import TreeCompiler from '../TreeCompiler.js';
import Scope from '../Scope.js';
import { CompilationError } from '../../../../errors.js';
import project from '../../../../Project.js';
import intToBytes from './Support/intToBytes.js';

const getchar = async function* (_, context) {
	context.returnValue = await project.terminal.getchar();
};

const allocateConstants = ({ constants }) => {
	const { memory } = project;
	for (let constant of constants) {
		const { size, bytes, arraySize } = constant;
		if (arraySize != null) {
			const arrayAddr = memory.allocate(arraySize);
			memory.set(arrayAddr, bytes);
			const addr = memory.allocate(4);
			memory.set(addr, intToBytes(arrayAddr));
			constant.addr = addr;
			constant.arrayAddr = arrayAddr;
		} else {
			const addr = memory.allocate(size);
			memory.set(addr, bytes);
			constant.addr = addr;
		}
	}
};

const freeConstants = ({ constants }) => {
	const { memory } = project;
	for (let constant of constants) {
		const { addr, arrayAddr } = constant;
		memory.free(addr);
		constant.addr = null;
		if (arrayAddr != null) {
			memory.free(arrayAddr);
			constant.arrayAddr = null;
		}
	}
};

new TreeCompiler({
	nonTerminal: 'program',
	compile: ({ content: lines }) => {
		const global = new Scope();
		global.set('getchar', {
			name: 'getchar',
			valueType: 'function',
			returnType: 'char',
			isFunction: true,
			argSign: [],
			scopeId: global.id,
			__override: getchar,
		});
		const globalVars = [];
		const context = {
			global,
			local: global,
			structs: {},
			returnType: null,
			structSign: null,
			varUidMap: {},
			scopeVars: globalVars,
			returnValue: null,
			constants: [],
		};
		for (let line of lines) {
			TreeCompiler.compile(line, context);
		}
		const main = global.items.main;
		if (!main) {
			throw new CompilationError('main function was not declared');
		}
		return context;
	},
	execute: async function* ({ content: lines }, context) {
		const { global } = context;
		const main = global.items.main.node;
		allocateConstants(context);
		console.log('running program');
		yield* TreeCompiler.execute(main, context);
		freeConstants(context);
	},
});
