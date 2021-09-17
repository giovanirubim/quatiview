import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'ptr-member-acc',
    parse: ({ tokenGenerator }) => {
        tokenGenerator.pop('arrow');
        return tokenGenerator.pop('id').content;
    },
});
