import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'member-acc',
    parse: ({ token }) => {
        token.pop('dot');
        return token.pop('id').content;
    },
});
