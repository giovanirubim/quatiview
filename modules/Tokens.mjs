import Token from './Token.mjs';
import Charset from './Charset.mjs';

// All C reserved words
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
	'register', 'return',
	'short', 'signed', 'sizeof', 'static', 'struct', 'switch',
	'typedef',
	'union', 'unsigned',
	'void', 'volatile',
	'while',
	'_Packed', 
];

// List of all token definitions
export const all = [

	// Reserved words
	... reservedWords.map((word) => new Token(word)),

	// Constants
	new Token({
		name: 'decimal-constant',
		pattern: /^([1-9]\d*|0)\.\d+\b/,
		headCharset: new Charset('0-9'),
	}),
	new Token({
		name: 'integer-constant',
		pattern: /^([1-9]\d*|0)\b/,
		headCharset: new Charset('0-9'),
	}),
	new Token({
		name: 'char-constant',
		pattern: /^'([^'\\]|\\[\x21-\x7e])'/,
		headCharset: new Charset("'"),
	}),
	new Token({
		name: 'string-constant',
		pattern: /^"([^"\\]|\\[\x21-\x7e])*"/,
		headCharset: new Charset('"'),
	}),

	// Two-character-long symbols
	new Token({ name: 'less-or-equal', pattern: '<=' }),
	new Token({ name: 'greater-or-equal', pattern: '>=' }),
	new Token({ name: 'equals', pattern: '==' }),
	new Token({ name: 'different', pattern: '!=' }),
	new Token({ name: 'arrow', pattern: '->' }),
	new Token({ name: 'logical-and', pattern: '&&' }),
	new Token({ name: 'logical-or', pattern: '||' }),

	// Single character symbols
	new Token({ name: 'ampersand', pattern: '&' }),
	new Token({ name: 'assing', pattern: '=' }),
	new Token({ name: 'asterisk', pattern: '*' }),
	new Token({ name: 'comma', pattern: ',' }),
	new Token({ name: 'dot', pattern: '.' }),
	new Token({ name: 'greater', pattern: '>' }),
	new Token({ name: 'left-brackets', pattern: '{' }),
	new Token({ name: 'left-parentheses', pattern: '(' }),
	new Token({ name: 'left-square-brackets', pattern: '[' }),
	new Token({ name: 'less', pattern: '<' }),
	new Token({ name: 'minus', pattern: '-' }),
	new Token({ name: 'percent', pattern: '%' }),
	new Token({ name: 'plus', pattern: '+' }),
	new Token({ name: 'right-brackets', pattern: '}' }),
	new Token({ name: 'right-parentheses', pattern: ')' }),
	new Token({ name: 'right-square-brackets', pattern: ']' }),
	new Token({ name: 'semicolon', pattern: ';' }),
	new Token({ name: 'slash', pattern: '/' }),

	// Others
	new Token({
		name: 'id',
		pattern: /^[a-zA-Z_]\w*/,
		headCharset: new Charset('a-z;A-Z;_'),
	}),
];

// Buids an object that maps for each character what group of tokens can start with that specific
// character
const byHeadMapEntries = new Array(256).fill().map((_, index) => {
	const char = String.fromCharCode(index);
	return [char, []];
});
const byHeadMap = Object.fromEntries(byHeadMapEntries);
all.forEach((token) => {
	token.headCharset.all().forEach((char) => {
		byHeadMap[char].push(token);
	});
});

// Returns the group of tokens that can start with the given char
export const getByHeadChar = (char) => byHeadMap[char];
