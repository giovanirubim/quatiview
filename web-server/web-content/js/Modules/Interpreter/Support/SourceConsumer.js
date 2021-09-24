const skipableCode = /^(\s+|\/\/[^\n]*|\/\*([^*]|\*[^\/])*\*\/|\/\*\*\*\/)+/;

export default class SourceConsumer {
	constructor(sourceCode) {
		this.sourceCode = sourceCode;
		this.remaining = sourceCode;
		this.findNext();
	}
	skip(amount) {
		this.remaining = this.remaining.substr(amount);
	}
	findNext() {
		const match = this.remaining.match(skipableCode);
		if (match === null) {
			return;
		}
		this.skip(match[0].length);
	}
	getIndex() {
		return this.sourceCode.length - this.remaining.length;
	}
	getState() {
		return this.getIndex();
	}
	setState(index) {
		this.remaining = this.sourceCode.substr(index);
		return this;
	}
	nextChar() {
		return this.remaining[0] ?? null;
	}
	next(pattern) {
		const match = this.remaining.match(pattern);
		if (match === null || match.index !== 0) {
			return null;
		}
		const [result] = match;
		this.skip(result.length);
		this.findNext();
		return result;
	}
	end() {
		return this.remaining === '';
	}
}
