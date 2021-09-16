import TreeCompiler from '../TreeCompiler.js';
import intToBytes from './Support/intToBytes.js';

const getContentData = (content) => {
    if (content.typeName === 'NULL') {
        return {
            size: 4,
            bytes: intToBytes(0),
            valueType: 'void*',
        };
    }
    if (content.typeName === 'int-const') {
        return {
            size: 4,
            bytes: intToBytes(Number(content.content)),
            valueType: 'int',
        };
    }
    if (content.typeName === 'char-const') {
        const str = content.content;
        const value = eval(str).charCodeAt(0);
        return {
            size: 1,
            bytes: [value],
            valueType: 'int',
        };
    }
    if (content.typeName === 'str-const') {
        const str = content.content;
        const middle = str.substr(1, str.length - 2);
        const bytes = [];
        for (let i=0; i<middle.length; ++i) {
            let char = middle[i];
            if (char === '\\') {
                char = eval(`'\\${middle[++i]}'`)
            }
            bytes.push(char.charCodeAt(0));
        }
        bytes.push(0);
        console.log(bytes);
        return {
            size: bytes.length,
            bytes,
            arraySize: bytes.length,
            valueType: 'char*',
        };
    }
    throw 'Not compiling strings yet';
};

new TreeCompiler({
	nonTerminal: 'const',
	compile: ({ content }, { constants }) => {
        const data = getContentData(content);
        constants.push(data);
        return data;
    },
    execute: async function* () {},
});
