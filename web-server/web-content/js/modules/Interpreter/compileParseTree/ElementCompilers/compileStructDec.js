import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'struct-dec',
	compile: ({ content }, context) => {
        const { structs } = context;
        const name = content.type.content.structName;
        if (structs[name]) {
            throw new CompilationError(`redefinition of 'struct ${name}'`, content.type.startsAt);
        }
        const structSign = { vars: {}, size: null };
        structs[name] = structSign;
        const { vars } = content;
        context.structSign = structSign;
        for (let item of vars) {
            TreeCompiler.compile(item, context);
        }
        context.structSign = null;
        structSign.size = Object.values(structSign.vars)
            .map(item => item.size)
            .reduce((a, b) => a + b);
	},
});
