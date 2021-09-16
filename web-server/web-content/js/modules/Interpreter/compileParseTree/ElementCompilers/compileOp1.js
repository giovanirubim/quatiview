import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'op1',
	compile: ({ content }, context) => {
        const { operand, operations } = content;
        let data = TreeCompiler.compile(operand, context);
		for (let operation of operations) {
			if (operation.typeName === 'arg-call') {
				if (data.valueType !== 'function') {
				}
			}
		}
	},
});
