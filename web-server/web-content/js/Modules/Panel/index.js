import { CompilationError, LexycalError, SyntaticError } from '../errors.js';
import Net from '../Net.js';
import getLineOf from './Support/getLineOf.js';

const button = {};

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
	$('#control-panel').append(`
		<div style="display:none">
			<input type="file" id="upload" accept=".c"/>
		</div>
	`.trim());
	const inputFile = $('#upload');
	bindInputFile(inputFile);
	return inputFile;
};

const reportCompilationError = (source, error) => {
	Net.terminal.writeln('Compilation failed');
	const { index } = error;
	if (index === source.length) {
		Net.terminal.writeln('Unexpected end of file');
		return;
	}
	if (error instanceof SyntaticError) {
		Net.terminal.writeln(`Syntax error: ${error.message}`);
	} else if (error instanceof LexycalError) {
		Net.terminal.writeln(`Unrecognized token`);
	} else {
		Net.terminal.writeln(`Error: ${error.message}`);
	}
	if (index != null) {
		const { line, lineCount, pos } = getLineOf(source, index);
		Net.terminal.writeln(`${lineCount.toString().padStart(4, ' ')} | ${line}`);
		Net.terminal.writeln(`${' '.repeat(4)} |${' '.repeat(pos)}^`);
	}
};

const start = async () => {
};

const step = async () => {
};	

const pause = async () => {
};

const play = async () => {
};

const run = async () => {
	Net.terminal.clear();
	const source = Net.editor.getText();
	try {
		await Net.interpreter.run(source);
	} catch (error) {
		if (error instanceof CompilationError) {
			reportCompilationError(source, error);
		} else {
			console.error(error);
		}
	}
};

export const init = () => {
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
	button.executar.on('click', run);
};
