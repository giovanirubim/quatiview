import { CompilationError } from '../../../../errors.js';
import NonTerminal from '../../../Model/NonTerminal.js';

const tokenToNonTerminal = {
    'left-parentheses': 'arg-call',
    'left-square-brackets': 'index-acc',
    'dot': 'member-acc',
    'arrow': 'ptr-member-acc',
};

const compileTree = (ctx, node) => {
    const { operand, operation } = node;
    if (operand == null) {
        return ctx.compile(node);
    }
    ctx.operand = compileTree(ctx, operand);
    return ctx.compile(operation);
};

new NonTerminal({
    name: 'op1',
    parse: (ctx) => {
        let root = ctx.parse('op0');
        for (;;) {
            const token = ctx.token.next();
            if (!token) break;
            const nonTerminal = tokenToNonTerminal[token.name];
            if (!nonTerminal) break;
            const operation = ctx.parse(nonTerminal);
            root = { operand: root, operation };
        }
        return root;
    },
    compile: (ctx, node) => compileTree(ctx, node.content),
});
