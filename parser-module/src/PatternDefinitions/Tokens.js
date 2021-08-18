const TokenSet = require('./TokenSet');
const Charset = require('../Charset');

const set = new TokenSet();

// All reserved words
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

reservedWords.forEach((word) => set.add(word));

// Constants
set.add({
	name: 'decimal-constant',
	pattern: /^([1-9]\d*|0)\.\d+\b/,
	headCharset: new Charset('0-9'),
});
set.add({
	name: 'integer-constant',
	pattern: /^([1-9]\d*|0)\b/,
	headCharset: new Charset('0-9'),
});
set.add({
	name: 'char-constant',
	pattern: /^'([^\n'\\]|\\[\x21-\x7e])'/,
	headCharset: new Charset("'"),
});
set.add({
	name: 'string-constant',
	pattern: /^"([^\n"\\]|\\[\x21-\x7e])*"/,
	headCharset: new Charset('"'),
});

// Two-character-long symbols
set.add({ name: 'less-or-equal', pattern: '<=' });
set.add({ name: 'greater-or-equal', pattern: '>=' });
set.add({ name: 'equals', pattern: '==' });
set.add({ name: 'different', pattern: '!=' });
set.add({ name: 'arrow', pattern: '->' });
set.add({ name: 'logical-and', pattern: '&&' });
set.add({ name: 'logical-or', pattern: '||' });

// Single character symbols
set.add({ name: 'ampersand', pattern: '&' });
set.add({ name: 'assing', pattern: '=' });
set.add({ name: 'asterisk', pattern: '*' });
set.add({ name: 'comma', pattern: ',' });
set.add({ name: 'dot', pattern: '.' });
set.add({ name: 'greater', pattern: '>' });
set.add({ name: 'left-brackets', pattern: '{' });
set.add({ name: 'left-parentheses', pattern: '(' });
set.add({ name: 'left-square-brackets', pattern: '[' });
set.add({ name: 'less', pattern: '<' });
set.add({ name: 'minus', pattern: '-' });
set.add({ name: 'percent', pattern: '%' });
set.add({ name: 'plus', pattern: '+' });
set.add({ name: 'right-brackets', pattern: '}' });
set.add({ name: 'right-parentheses', pattern: ')' });
set.add({ name: 'right-square-brackets', pattern: ']' });
set.add({ name: 'semicolon', pattern: ';' });
set.add({ name: 'slash', pattern: '/' });

// Others
set.add({
	name: 'id',
	pattern: /^[a-zA-Z_]\w*/,
	headCharset: new Charset('a-z;A-Z;_'),
});

module.exports = set;