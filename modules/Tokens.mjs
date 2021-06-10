import Token from './Token.mjs';
import Charset from './Charset.mjs';

export const all = [
	new Token({
		type: 'for',
		pattern: /^for\b/,
		headCharset: new Charset('f'),
	}),
	new Token({
		type: 'int-type',
		pattern: /^int\b/,
		headCharset: new Charset('i'),
	}),
	new Token({
		type: 'integer',
		pattern: /^([1-9]\d*|0)\b/,
		headCharset: new Charset('0-9'),
	}),
	new Token({
		type: 'if',
		pattern: /^if\b/,
		headCharset: new Charset('i'),
	}),
	new Token({
		type: 'id',
		pattern: /^[a-zA-Z_]\w*/,
		headCharset: new Charset('a-z;A-Z;_'),
	}),
	new Token({
		type: 'assing',
		pattern: /^=/,
		headCharset: new Charset('='),
	}),
	new Token({
		type: 'left-parentheses',
		pattern: /^\(/,
		headCharset: new Charset('('),
	}),
	new Token({
		type: 'right-parentheses',
		pattern: /^\)/,
		headCharset: new Charset(')'),
	}),
	new Token({
		type: 'left-brackets',
		pattern: /^\{/,
		headCharset: new Charset('{'),
	}),
	new Token({
		type: 'right-brackets',
		pattern: /^\}/,
		headCharset: new Charset('}'),
	}),
	new Token({
		type: 'increment-assign',
		pattern: /^\+=/,
		headCharset: new Charset('+'),
	}),
	new Token({
		type: 'semicolon',
		pattern: /^;/,
		headCharset: new Charset().add(';'),
	}),
	new Token({
		type: 'less-then',
		pattern: /^</,
		headCharset: new Charset('<'),
	}),
];

export const eof = new Token({
	type: 'end-of-file',
	pattern: /^$/,
	headCharset: new Charset(),
});

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

export const getByHeadChar = (char) => byHeadMap[char];
