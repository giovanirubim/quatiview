const stringToBytes = (string) => {
	const chars = string.split('');
	return chars.map((char) => char.charCodeAt(0));
};

const pop = (array) => {
	const [ item ] = array.splice(0, 1);
	return item;
};

class Terminal {
	constructor({
		textarea,
		input,
	}) {
		this.textarea = textarea;
		this.input = input;
		this.buffer = [];
		this.readyHandler = null;
		this.disable();
		input.on('keydown', (e) => {
			if (!/enter/i.test(e.key)) {
				return;
			}
			if (e.ctrlKey && e.shiftKey && e.altKey) {
				return;
			}
			this.disable();
			const string = input[0].value + '\n';
			input.val('');
			this.buffer.push(...stringToBytes(string));
			const { readyHandler } = this;
			if (readyHandler !== null) {
				this.readyHandler = null;
				readyHandler(pop(this.buffer));
			}
		});
	}
	enable() {
		this.input.removeAttr('disabled');
		return this;
	}
	disable() {
		this.input.attr({ disabled: 'true' });
		return this;
	}
	putchar(byte) {
		this.textarea[0].value += String.fromCharCode(byte);
		return this;
	}
	getchar() {
		if (this.buffer.length === 0) {
			this.enable();
			return new Promise((done) => this.readyHandler = done);
		}
		return Promise.resolve(pop(this.buffer));
	}
	writeln(string) {
		this.textarea[0].value += string + '\n';
		return this;
	}
	clear() {
		this.textarea[0].value = '';
		return this;
	}
}

export default Terminal;
