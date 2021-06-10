// Add possibility of /***/ comment
const skipableCode = /^(\s+|\/\/[^\n]*|\/\*([^*]|\*[^\/])*\*\/)+/;

class SourceConsumer {
	constructor(sourceCode) {
		this.sourceCode = sourceCode;
		this.remainig = sourceCode;
		this.findNext();
	}
	skip(amount) {
		this.remainig = this.remainig.substr(amount);
	}
	findNext() {
		const match = this.remainig.match(skipableCode);
		if (match === null) {
			return;
		}
		this.skip(match[0].length);
	}
	getIndex() {
		return this.sourceCode.length - this.remainig.length;
	}
	setIndex(index) {
		this.remainig = this.sourceCode.substr(index);
		return this;
	}
	nextChar() {
		return this.remainig[0] ?? null;
	}
	next(pattern) {
		const match = this.remainig.match(pattern);
		if (match === null || match.index !== 0) {
			return null;
		}
		const [result] = match;
		this.skip(result.length);
		this.findNext();
		return result;
	}
	end() {
		return this.remainig === '';
	}
}

export default SourceConsumer;
