import Charset from '../../Support/Charset.js';
import Token from '../../Model/Token.js';

const entries = new Array(256).fill().map((_, index) => {
	const char = String.fromCharCode(index);
	return [char, []];
});

const byHeadMap = Object.fromEntries(entries);
const byTypeNameMap = {};

const add = (...args) => {
	const token = new Token(...args);
	token.headCharset.all().forEach((char) => {
		byHeadMap[char].push(token);
	});
	byTypeNameMap[token.typeName] = token;
};

// Reserved words
const reservedWords = [
	'auto',
	'break',
	'case', 'char', 'const', 'continue',
	'default', 'do', 'double',
	'else', 'enum', 'extern',
	'float', 'for',
	'goto',
	'if', 'int',
	'long',
	'NULL',
	'register', 'return',
	'short', 'signed', 'sizeof', 'static', 'struct', 'switch',
	'typedef',
	'union', 'unsigned',
	'void', 'volatile',
	'while',
	'_Packed',
];

reservedWords.forEach((word) => add(word));

// Consntants
add({
	name: 'int-const',
	pattern: /^([1-9]\d*|0)\b/,
	headCharset: new Charset('0-9'),
});
add({
	name: 'char-const',
	pattern: /^'([^\n'\\]|\\[\x21-\x7e])'/,
	headCharset: new Charset("'"),
});
add({
	name: 'str-const',
	pattern: /^"([^\n"\\]|\\[\x21-\x7e])*"/,
	headCharset: new Charset('"'),
});

// Two-character-long symbols
add({ name: 'less-or-equal', pattern: '<=' });
add({ name: 'greater-or-equal', pattern: '>=' });
add({ name: 'equals', pattern: '==' });
add({ name: 'different', pattern: '!=' });
add({ name: 'arrow', pattern: '->' });
add({ name: 'logical-and', pattern: '&&' });
add({ name: 'logical-or', pattern: '||' });

// Single character symbols
add({ name: 'ampersand', pattern: '&' });
add({ name: 'exclamation-mark', pattern: '!' });
add({ name: 'assign', pattern: '=' });
add({ name: 'asterisk', pattern: '*' });
add({ name: 'comma', pattern: ',' });
add({ name: 'dot', pattern: '.' });
add({ name: 'greater', pattern: '>' });
add({ name: 'left-brackets', pattern: '{' });
add({ name: 'left-parentheses', pattern: '(' });
add({ name: 'left-square-brackets', pattern: '[' });
add({ name: 'less', pattern: '<' });
add({ name: 'minus', pattern: '-' });
add({ name: 'percent', pattern: '%' });
add({ name: 'plus', pattern: '+' });
add({ name: 'right-brackets', pattern: '}' });
add({ name: 'right-parentheses', pattern: ')' });
add({ name: 'right-square-brackets', pattern: ']' });
add({ name: 'semicolon', pattern: ';' });
add({ name: 'slash', pattern: '/' });

// Id
add({
	name: 'id',
	pattern: /^[a-zA-Z_]\w*/,
	headCharset: new Charset('a-z;A-Z;_'),
});
	
export const getByHeadChar = (char) => {
	return byHeadMap[char] ?? [];
};
	
export const getByTypeName = (typeName) => {
	return byTypeNameMap[typeName] ?? null;
};
