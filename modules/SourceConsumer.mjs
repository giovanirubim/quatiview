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
	get index() {
		return this.sourceCode.length - this.remainig.length;
	}
	set index(index) {
		this.remainig = this.sourceCode.substr(index);
	}
	nextChar() {
		return this.remainig[0] ?? null;
	}
}

export default SourceConsumer;
