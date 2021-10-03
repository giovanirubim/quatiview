import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';
import { isStruct } from './Support/Type.js';

new NonTerminal({
    name: 'member-acc',
    parse: ({ token }) => {
        token.pop('dot');
        return token.pop('id').content;
    },
    compile: (ctx, node) => {
        const { operand } = ctx;
        const name = node.content;
        if (!isStruct(operand.type)) {
            new CompilationError(
                `request for member '${name}' in something not a structure`,
                node.startsAt,
            );
        }
        const structName = operand.type.replace(/^struct\s/, '');
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
            src: operand,
            offset: member.offset,
            type: member.type,
            size: member.size,
        };
    },
});
