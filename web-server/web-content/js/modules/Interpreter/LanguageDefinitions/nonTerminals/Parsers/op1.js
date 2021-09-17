import NonTerminal from '../../../Model/NonTerminal.js';

const tokenToNonTerminal = {
    'left-parentheses': 'arg-call',
    'left-square-brackets': 'index-acc',
    'dot': 'member-acc',
    'arrow': 'ptr-member-acc',
};

new NonTerminal({
    name: 'op1',
    parse: (ctx) => {
        let root = ctx.parse('op0');
        for (;;) {
            const token = ctx.tokenGenerator().next();
            if (!token) break;
            const nonTerminal = tokenToNonTerminal[token.name];
            if (!nonTerminal) break;
            const operation = ctx.parse(nonTerminal);
            root = { operand: root, operation };
        }
        return root;
    },
});
