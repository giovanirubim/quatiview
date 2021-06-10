import Charset from './Charset.mjs';

class Token {
	constructor({ type, pattern, headCharset }) {
		this.type = type;
		this.pattern = pattern;
		this.headCharset = headCharset;
	}
}

export default Token;
