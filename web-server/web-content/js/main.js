import * as Editor from './modules/Editor';
import * as MemViewer from './modules/MemViewer';
import * as Panel from './modules/Panel';
import Terminal from './modules/Terminal';
import Interpreter from './modules/Interpreter';

window.Interpreter = Interpreter;

const loadMemView = () => {
	const wrappingElement = $('#mem-view-section');
	const updateSize = () => {
		MemViewer.resize({
			width: parseInt(wrappingElement.css('width')),
			height: parseInt(wrappingElement.css('height')),
		});
	};
	MemViewer.setCanvas($('canvas')[0]);
	$(window).bind('resize', updateSize);
	updateSize();
};

$(document).ready(() => {
	Editor.load();
	Editor.focus();
	loadMemView();
	MemViewer.start();
	const terminal = new Terminal({
		textarea: $('#terminal-section textarea'),
		input: $('#terminal-input'),
	});
	Panel.load();
	Panel.onupload((source) => Editor.setText(source));
	window.terminal = terminal;
	$('form').on('submit', (e) => e.preventDefault());
});
