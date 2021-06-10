import Charset from './Charset.mjs';

class Token {
	constructor({ type, pattern, headCharset }) {
		this.type = type;
		this.pattern = pattern;
		this.headCharset = headCharset;
	}
	match(sourceCode) {
		const match = this.pattern.match(sourceCode);
		if (match === null) {
			return null;
		}
		const { 0: string, index } = match;
		if (index !== 0) {
			return null;
		}
		return string;
	}
}

export default Token;
