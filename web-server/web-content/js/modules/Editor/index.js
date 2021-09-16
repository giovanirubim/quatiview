let textarea;

const storeText = () => {
	localStorage?.setItem?.('src-code', getText());
};

const loadText = () => {
	setText(localStorage?.getItem?.('src-code') ?? '');
};

const bindTextarea = () => {
	textarea.on('keyup change', () => {
		storeText();
	});
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

export const load = () => {
	textarea = $('#editor-section textarea');
	loadText();
	bindTextarea();
};

export const getText = () => {
	return textarea.val();
};

export const setText = (text) => {
	textarea.val(text);
};

export const highlight = (start, end) => {
	textarea.trigger('select');
	textarea[0].selectionStart = start;
	textarea[0].selectionEnd = end;
};

export const lock = () => {
	textarea.attr('disabled', 'true');
};

export const unlock = () => {
	textarea.removeAttr('disabled');
};

export const isLocked = () => {
	return !!textarea.attr('disabled');
};

export const focus = () => {
	textarea.focus();
};