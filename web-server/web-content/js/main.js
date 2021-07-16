import * as editor from './editor.js';
import * as render from './render.js';
import * as panel from './panel.js';
import * as terminal from './terminal.js';

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
	terminal.load();
	terminal.write('((-,2,-),5,(-,9,-))\n');
	terminal.write('Program exited with code 0');
	panel.load();
	panel.onupload((source) => editor.setText(source));
});
