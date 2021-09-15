import TreeCompiler from '../TreeCompiler.js';

const getContentData = (content) => {
    if (content.typeName === 'NULL') {
        return {
            value: 0,
            valueType: 'void*',
        };
    }
    if (content.typeName === 'int-const') {
        return {
            value: Number(content.content),
            valueType: 'int',
        };
    }
    if (content.typeName === 'char-const') {
        return {
            value: content.content.charCodeAt(1),
            valueType: 'int',
        };
    }
    if (content.typeName === 'str-const') {
        return {
            stringContent: content.content,
            stringConst: true,
            valueType: 'char*',
        };
    }
};

new TreeCompiler({
	nonTerminal: 'const',
	compile: ({ content }) => {
        return getContentData(content);
    },
});
