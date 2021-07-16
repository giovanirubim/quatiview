import * as editor from './editor.js';
import * as render from './render.js';

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
});
