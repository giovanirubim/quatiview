import Net from '../Net.js';

let textarea;
let input;
const buffer = [];

const disableInput = () => {
	input.attr({ disabled: 'true' });
};

const bindInput = () => input.on('keydown', (e) => {
	if (!/enter/i.test(e.key)) {
		return;
	}
	if (e.ctrlKey && e.shiftKey && e.altKey) {
		return;
	}
	disableInput();
	const string = input.val() + '\n';
	input.val('');
	for (let char of string) {
		const byte = char.charCodeAt(0);
		buffer.push(byte);
	}
	Net.execution.handleInput();
});

export const popChar = () => {
	if (buffer.length === 0) {
		return null;
	}
	const [ byte ] = buffer.splice(0, 1);
	return byte;
};

export const init = () => {
	textarea = $('#terminal-section textarea');
	input = $('#terminal-section input');
	disableInput();
	bindInput();
};	

export const enableInput = () => {
	input.removeAttr('disabled');
	input.focus();
};	

export const putchar = (byte) => {
	textarea[0].value += String.fromCharCode(byte);
};	

export const writeln = (string) => {
	textarea[0].value += string + '\n';
};

export const clear = () => {
	textarea.val('');
	buffer.length = 0;
	input.val('');
	disableInput();
};
