import NonTerminal from '../../../Model/NonTerminal.js';

new NonTerminal({
    name: 'member-acc',
    parse: ({ tokenGenerator }) => {
        tokenGenerator.pop('dot');
        return tokenGenerator.pop('id').content;
    },
});
