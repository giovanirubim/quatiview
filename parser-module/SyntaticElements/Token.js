const Token = require('./SyntaticElement.js');
const Charset = require('./Charset.js');

const stringToRegex = (pattern) => {
	let strRegex = '^';
	strRegex += pattern.replace(/([+\-\/{}()\[\]|.$*])/g, '\\$1');
	if (/\w/.test(pattern[pattern.length - 1])) {
		strRegex += '\\b';
	}
	return new RegExp(strRegex);
};

class Token {
	constructor(args) {
		if (typeof args === 'string') {
			this.pattern = stringToRegex(args);
			this.name = args;
			this.headCharset = new Charset().add(args[0]);
			return;
		}
		const { name, pattern, headCharset } = args;
		this.name = name ?? pattern;
		if (typeof pattern === 'string') {
			this.pattern = stringToRegex(pattern);
			this.headCharset = new Charset().add(pattern[0]);
		} else {
			this.pattern = pattern;
			this.headCharset = headCharset;
		}
	}
}

module.exports = Token;
