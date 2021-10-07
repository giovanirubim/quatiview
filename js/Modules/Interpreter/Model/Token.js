import Charset from '../Support/Charset.js';

const stringToRegex = (pattern) => {
	let strRegex = '^';
	strRegex += pattern.replace(/([+\-\/{}()\[\]|.$*])/g, '\\$1');
	if (/\w/.test(pattern[pattern.length - 1])) {
		strRegex += '\\b';
	}
	return new RegExp(strRegex);
};

export default class Token {
	constructor(args) {
		if (typeof args === 'string') {
			this.name = args;
			this.pattern = stringToRegex(args);
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
