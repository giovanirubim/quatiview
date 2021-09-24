import Net from './Modules/Net.js';

window.Net = Net;

$(document).ready(() => {

	Net.editor.init();
	Net.panel.init();
	Net.terminal.init();
	Net.memViewer.init();

	Net.memViewer.addStruct('binary_search_tree')
	.member({
		offset: 0,
		type: 'int',
		col: 0,
		row: 0,
		length: 4,
	})
	.member({
		offset: 4,
		type: 'struct foo*',
		col: 0,
		row: 1,
		length: 2,
	})
	.member({
		offset: 8,
		type: 'struct foo*',
		col: 2,
		row: 1,
		length: 2,
	});

	Net.memViewer.addStruct('linked_list')
	.member({
		offset: 0,
		type: 'int',
		col: 0,
		row: 0,
		length: 3,
	})
	.member({
		offset: 4,
		type: 'struct foo*',
		col: 0,
		row: 1,
		length: 3,
	});

});
