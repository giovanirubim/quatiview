import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'id',
    parse: (ctx) => {
        const name = ctx.token.pop('id').content;
        return { name };
    },
    compile: (ctx, node) => {
        const { name } = node.content;
        const data = ctx.local.get(name);
        if (!data) {
            throw new CompilationError(`'${name}' undeclared`, node.startsAt);
        }
        if (data.returnType != null) {
            return data;
        }
        return data;
    },
});
