import * as editor from './editor.js';
import * as render from './render.js';
import * as panel from './panel.js';
import * as memory from './memory.js';
import Terminal from './Terminal.js';

const loadMemView = () => {
	const memView = $('#mem-view-section');
	const updateSize = () => {
		render.resize({
			width: parseInt(memView.css('width')),
			height: parseInt(memView.css('height')),
		});
	};
	render.setCanvas($('canvas')[0]);
	$(window).bind('resize', updateSize);
	updateSize();
};

$(document).ready(() => {
	editor.load();
	editor.focus();
	loadMemView();
	render.start();
	const terminal = new Terminal({
		textarea: $('#terminal-section textarea'),
		input: $('#terminal-input'),
	});
	panel.load();
	panel.onupload((source) => editor.setText(source));
	window.terminal = terminal;
	$('form').on('submit', (e) => e.preventDefault());
});
