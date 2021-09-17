import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-item',
    parse: ({ tokenGenerator }) => {
        const pointerCount = tokenGenerator.popMany('asterisk').length;
        const name = tokenGenerator.pop('id').content;
        return { name, pointerCount };
    },
});
