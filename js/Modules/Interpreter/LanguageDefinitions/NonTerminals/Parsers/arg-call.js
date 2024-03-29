import NonTerminal from '../../../Model/NonTerminal.js';
import { CompilationError } from '../../../../errors.js';
import { isAssignable, isStruct } from './Support/Type.js';

new NonTerminal({
    name: 'arg-call',
    parse: (ctx) => {
        const args = [];
        ctx.token.pop('left-parentheses');
        if (ctx.token.popIfIs('right-parentheses')) {
            return args;
        }
        args.push(ctx.parse('expr'));
        while (ctx.token.popIfIs('comma')) {
            args.push(ctx.parse('expr'));
        }
        ctx.token.pop('right-parentheses');
        return args;
    },
    compile: (ctx, node) => {
        const { content } = node;
        const fn = ctx.operand;
		if (!fn.type.includes('(*)')) {
			throw new CompilationError(
				`'${fn.type}' is not a function`,
				node.startsAt,
			);
		}
        const args = content.map((item) => ctx.compile(item));
        let structAllocation = null;
        if (content.length === 1 && content[0].name === 'sizeof') {
            const type = content[0].content;
            if (isStruct(type) && ctx.operand.name === 'malloc') {
                structAllocation = type.replace(/^struct\s/, '');
            }
        }
        if (args.length > fn.args.length) {
            throw new CompilationError(
                `too many arguments to function '${fn.name}'`,
                node.startsAt,
            );
        }
        if (args.length < fn.args.length) {
            throw new CompilationError(
                `too few arguments to function '${fn.name}'`,
                node.startsAt,
            );
        }
        for (let i=0; i<args.length; ++i) {
            if (!isAssignable(fn.args[i].type, args[i].type)) {
                throw new CompilationError(
                    `incompatible type for argument ${i + 1} of '${fn.name}'`,
                    content[i].startsAt,
                );
            }
        }
        const res = {
            instruction: 'call',
            fn,
            args,
            type: fn.returnType,
            structAllocation,
        };
        return res;
    },
});
