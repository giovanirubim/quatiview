let button = {};
let uploadHandlers = [];

const bindInputFile = (inputFile) => {
	inputFile.on('change', function() {
		const { files } = this;
		if (!files?.length) {
			return;
		}
		const [file] = files;
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target.result;
			uploadHandlers.forEach((handler) => handler(text));
		};
		reader.readAsText(file);
		inputFile.val('');
	});
};

const createInputFile = () => {
	$('#control-panel').append(`<div style="display:none">
		<input type="file" id="upload" accept=".c"/>
	</div>`);
	const inputFile = $('#upload');
	bindInputFile(inputFile);
	return inputFile;
};

export const load = () => {
	const buttons = $('#control-panel .panel-button');
	buttons.each(function() {
		const item = $(this);
		let name = item.attr('title')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[^\x00-\x7f]/g, '');
		button[name] = item;
	});
	const inputFile = createInputFile();
	button.upload.on('click', () => {
		inputFile.trigger('click');
	});
};

export const onupload = (handler) => {
	uploadHandlers.push(handler);
};
