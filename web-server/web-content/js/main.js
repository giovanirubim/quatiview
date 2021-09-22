import Net from './Modules/Net.js';

window.Net = Net;

$(document).ready(() => {
    Net.editor.init();
	Net.panel.init();
	Net.terminal.init();
});
