import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-member-acc',
    parse: ({ token }) => {
        token.pop('arrow');
        return token.pop('id').content;
    },
    compile: (ctx, node) => {
        const { operand } = ctx;
        const name = node.content;
        const resType = operand.type.replace(/\*$/, '');
        if (!resType.endsWith('*') || !typeIsStruct(resType)) {
            new CompilationError(
                `invalid type argument of '->'`,
                node.startsAt,
            );
        }
        const structName = resType.replace(/^struct\s/, '');
        const struct = ctx.structs[structName];
        const member = struct.members[name];
        if (!member) {
            throw new CompilationError(
                `'${operand.type}' has no member named '${name}'`,
                node.startsAt,
            );
        }
        return {
            instruction: 'member',
            src: {
                instruction: 'ptr-acc',
                type: resType,
                src: operand,
            },
            offset: member.offset,
            type: member.type,
            size: member.size,
        };
    },
});
