import NonTerminal from "../../../Model/NonTerminal.js";

new NonTerminal({
    name: 'var-item',
    parse: (ctx) => {
        const pointerCount = ctx.token.popMany('asterisk').length;
        const id = ctx.token.pop('id');
        const name = id.content;
        const type = ctx.current.varDec.type + '*'.repeat(pointerCount);
        const size = ctx.getTypeSize(type, id.startsAt);
        const { structDec, varDec } = ctx.current;
        if (structDec) {
            structDec.members[name] = {
                name,
                size,
                type,
            };
        }
    },
});
