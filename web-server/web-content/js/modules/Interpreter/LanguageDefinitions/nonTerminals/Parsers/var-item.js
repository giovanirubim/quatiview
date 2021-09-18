import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-item',
    parse: ({ token }) => {
        const pointerCount = token.popMany('asterisk').length;
        const name = token.pop('id').content;
        return { name, pointerCount };
    },
});
