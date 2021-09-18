import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-member-acc',
    parse: ({ token }) => {
        token.pop('arrow');
        return token.pop('id').content;
    },
});
