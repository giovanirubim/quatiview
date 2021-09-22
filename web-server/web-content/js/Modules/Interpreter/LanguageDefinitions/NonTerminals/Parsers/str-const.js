import NonTerminal from "../../../Model/NonTerminal.js";

const nextToByte = {
    '\\': '\\'.charCodeAt(0),
    'n': '\n'.charCodeAt(0),
    't': '\t'.charCodeAt(0),
    '0': 0,
    '"': '"'.charCodeAt(0),
    "'": "'".charCodeAt(0),
};

new NonTerminal({
    name: 'str-const',
    parse: (ctx) => {
        const src = ctx.token.pop('str-const').content;
        const bytes = [];
        const end = src.length - 1;
        for (let i=1; i<end; ++i) {
            const char = src[i];
            const byte = char.charCodeAt(0) & 255;
            if (char !== '\\') {
                bytes.push(byte);
            } else {
                const next = src[++i];
                bytes.push(nextToByte[next]);
            }
        }
        bytes.push(0);
        return bytes;
    },
    compile: (ctx, { content: bytes }) => {
        const data = ctx.createUid({
            type: 'char*',
            value: null,
            bytes,
        });
        ctx.consts.push(data);
        return data;
    },
});
