import project from "./project.js";

const { terminal, editor, memViewer, panel } = project;

const loadMemView = () => {
	const wrappingElement = $('#mem-view-section');
	const updateSize = () => {
		memViewer.resize({
			width: parseInt(wrappingElement.css('width')),
			height: parseInt(wrappingElement.css('height')),
		});
	};
	memViewer.setCanvas($('canvas')[0]);
	$(window).bind('resize', updateSize);
	updateSize();
};

$(document).ready(() => {
	terminal.init({
		textarea: $('#terminal-section textarea'),
		input: $('#terminal-input'),
	});
	editor.load();
	editor.focus();
	loadMemView();
	memViewer.start();
	panel.init();
	panel.onupload((source) => project.editor.setText(source));
	$('form').on('submit', (e) => e.preventDefault());
});

window.project = project;
