let textarea;
let input;
const buffer = [];
const readyHandler = null;

const stringToBytes = (string) => {
	const chars = string.split('');
	return chars.map((char) => char.charCodeAt(0));
};

const handleInput = () => {
};

const bindInput = () => input.on('keydown', (e) => {
	if (!/enter/i.test(e.key)) {
		return;
	}
	if (e.ctrlKey && e.shiftKey && e.altKey) {
		return;
	}
	disable();
	const string = input[0].value + '\n';
	input.val('');
	buffer.push(...stringToBytes(string));
	handleInput();
});

export const init = ({ textarea, input }) => {
	textarea = textarea;
	input = input;
	disable();
	bindInput();
};

export const enable = () => {
	input.removeAttr('disabled');
};

export const disable = () => {
	input.attr({ disabled: 'true' });
};

export const putchar = (byte) => {
	textarea[0].value += String.fromCharCode(byte);
};

export const getchar = () => {
	if (buffer.length === 0) {
		enable();
		return new Promise((done) => readyHandler = done);
	}
	return Promise.resolve(pop(buffer));
};

export const writeln = (string) => {
	textarea[0].value += string + '\n';
};

export const clear = () => {
	textarea[0].value = '';
};
