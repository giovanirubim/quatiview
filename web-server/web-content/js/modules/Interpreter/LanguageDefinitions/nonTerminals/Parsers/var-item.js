import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-item',
    parse: (ctx) => {
        const { token } = ctx;
        const { varDec: { type, size }, structDec } = ctx.current;
        if (structDec) {
            const offset = structDec.currentOffset;
            structDec.currentOffset += size;
        }
        const pointerCount = token.popMany('asterisk').length;
        const name = token.pop('id').content;
        return { name, pointerCount };
    },
});
