import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';
import ByteSet from './Support/ByteSet.js';

new TreeCompiler({
	nonTerminal: 'id',
	compile: (node, { local }) => {
        const { content, startsAt } = node;
        const name = content;
        const data = local.get(name);
        if (!data) {
            throw new CompilationError(`'${name}' undeclarated`, startsAt);
        }
        if (!data.isFunction && data.valueType !== 'function') {
            node.byteSet = new ByteSet({ data });
        }
        node.data = data;
        return data;
	},
    execute: async function* (node, context) {},
});
