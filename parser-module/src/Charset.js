class Charset {
	constructor(pattern) {
		this.map = new Array(256).fill(false);
		if (pattern) {
			const groups = pattern.split(';');
			for (let group of groups) {
				const [a, b = a] = group === '-' ? ['-', '-'] : group.split('-');
				const first = a.charCodeAt(0);
				const last = b.charCodeAt(0);
				for (let i=first; i<=last; ++i) {
					this.addByte(i);
				}
			}
		}
	}
	addByte(byte) {
		this.map[byte] = true;
	}
	add(char) {
		this.addByte(char.charCodeAt(0));
		return this;
	}
	fill() {
		this.map.forEach((_, index, map) => map[index] = true);
		return this;
	}
	has(char) {
		return this.map[char.charCodeAt(0)];
	}
	all() {
		return this.map
			.map((value, index) => value? index: null)
			.filter((item) => item !== null)
			.map((byte) => String.fromCharCode(byte));
	}
}

module.exports = Charset;
