let textarea;
let input;
let inputBuffer = '';

export const load = () => {
	textarea = $('#terminal-section textarea');
	input = $('#terminal-section input');
};

export const write = (text) => {
	textarea.val(textarea.val() + text);
};

export const next = () => new Promise((done) => {
	if (inputBuffer.length) {
		const char = inputBuffer[0];
		inputBuffer = inputBuffer.substr(1);
		done(char);
	}
});

export const focus = () => {
	input.focus();
};
