const USE_CODEMIRROR = true;

let textarea;
let codemirror;

const storeText = () => {
	localStorage?.setItem?.('src-code', getText());
};

const loadText = () => {
	setText(localStorage?.getItem?.('src-code') ?? '');
};

const handleInput = () => {
	storeText();
};

const bindTextarea = () => {
	textarea.on('input', handleInput);
	textarea.on('keydown', (e) => {
		if (e.key !== 'Tab') return;
		if (e.ctrlKey || e.altKey || e.shiftKey) return;
		e.preventDefault();
		e.stopPropagation();
		const [dom] = textarea;
		let a = dom.selectionStart;
		let b = dom.selectionEnd;
		const text = getText();
		const bef = text.substr(0, a);
		const mid = text.substring(a, b);
		const aft = text.substr(b);
		setText(bef + '\t' + aft);
		dom.selectionStart = a + 1;
		dom.selectionEnd = a + 1;
	});
};

const bindCodemirror = () => {
	codemirror.on('change', handleInput);
};

export const getLineOf = (index) => {
	const source = getText();
	let line = 1;
	for (let i=0; i<index; ++i) {
		if (source[i] === '\n') ++ line;
	}
	let a = index - 1, b = index;
	while (a >= 0 && source[a] !== '\n') {
		-- a;
	}
	while (b < source.length && source[b] !== '\n') {
		++ b;
	}
	const lineContent = source.substring(a + 1, b);
	return { line, ch: index - a, lineContent };
};

export const init = () => {
	const section = $('#editor-section');
	textarea = section.find('textarea');
	loadText();
	if (USE_CODEMIRROR) {
		codemirror = CodeMirror.fromTextArea(textarea[0], {
			mode: 'text/x-csrc',
			theme: 'ayu-mirage',
			lineNumbers: true,
		});
		codemirror.setSize(
			Number(section.css('width').replace('px', '')),
			Number(section.css('height').replace('px', '')),
		);
		bindCodemirror();
	} else {
		bindTextarea();
	}
};

export const getText = () => {
	if (USE_CODEMIRROR) {
		return codemirror.getValue();
	} else {
		return textarea.val();
	}
};

export const setText = (text) => {
	if (codemirror) {
		codemirror.setValue(text);
	} else {
		textarea.val(text);
	}
};

export const highlight = (start, end) => {
	if (codemirror) {
		const lineA = getLineOf(start).line - 1;
		const lineB = getLineOf(end).line;
		codemirror.setSelection({ line: lineA, ch: 0 }, { line: lineB, ch: 0 });
	} else {
		textarea.trigger('select');
		textarea[0].selectionStart = start;
		textarea[0].selectionEnd = end;
	}
};

export const lock = () => {
	if (codemirror) {
		codemirror.setOption('readOnly', true);
	}
	// textarea.attr('disabled', 'true');
};

export const unlock = () => {
	if (codemirror) {
		codemirror.setOption('readOnly', false);
	}
	// textarea.removeAttr('disabled');
};

export const focus = () => {
	textarea.focus();
};
