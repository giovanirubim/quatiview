import Token from './Token.mjs';
import Charset from './Charset.mjs';

export const all = [
	new Token({
		type: 'for',
		pattern: /^for\b/g,
		headCharset: new Charset('f'),
	}),
	new Token({
		type: 'if',
		pattern: /^if\b/g,
		headCharset: new Charset('i'),
	}),
	new Token({
		type: 'id',
		pattern: /^[a-zA-Z_]\w*/g,
		headCharset: new Charset('a-z;A-Z;_'),
	}),
];

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
