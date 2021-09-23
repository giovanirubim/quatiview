import { CompilationError, LexycalError, RuntimeError, SyntaticError } from '../errors.js';
import Net from '../Net.js';
import getLineOf from './Support/getLineOf.js';

let paused = true;
let running = true;
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
			Net.editor.setText(e.target.result);
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

const reportRuntimeError = (error) => {
	Net.terminal.writeln('');
	Net.terminal.writeln('Runtime error: ' + error.message);
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
	Net.eventManager.step();
};

const pause = async () => {
	if (paused) {
		return;
	}
	paused = true;
	button.pause.addClass('hidden');
	button.unpause.removeClass('hidden');
	button.next.removeClass('hidden');
	stopLoop();
};

let interval = null;
const startLoop = () => {
	interval = setInterval(() => {
		step();
	}, 100);
};

const stopLoop = () => {
	if (interval !== null) {
		clearInterval(interval);
		interval = null;
	}
};

const handleExit = () => {
	stopLoop();
	running = false;
	Net.editor.unlock();
	button.run.removeClass('hidden');
	button.unpause.addClass('hidden');
	button.pause.addClass('hidden');
	button.next.addClass('hidden');
};

const handleStart = () => {
	running = true;
	paused = true;
	button.run.addClass('hidden');
	button.unpause.removeClass('hidden');
	button.next.removeClass('hidden');
	Net.editor.lock();
};

const unpause = async () => {
	if (!paused) {
		return;
	}
	paused = false;
	button.pause.removeClass('hidden');
	button.unpause.addClass('hidden');
	button.next.addClass('hidden');
	startLoop();
};

const run = async () => {
	console.clear();
	Net.terminal.clear();
	const source = Net.editor.getText();
	try {
		handleStart();
		await Net.interpreter.run(source);
		handleExit();
		Net.terminal.writeln('Program exited');
	} catch (error) {
		handleExit();
		if (error instanceof CompilationError) {
			reportCompilationError(source, error);
		} else if (error instanceof RuntimeError) {
			reportRuntimeError(error);
		} else {
			console.error(error);
		}
	}
};

export const init = () => {
	const buttons = $('#control-panel .panel-button');
	buttons.each(function() {
		const item = $(this);
		let id = item.attr('button-id');
		button[id] = item;
	});
	const inputFile = createInputFile();
	button.upload.on('click', () => {
		inputFile.trigger('click');
	});
	button.run.on('click', run);
	button.pause.on('click', pause);
	button.unpause.on('click', unpause);
	button.next.on('click', step);
	$(window).on('keydown', (e) => {
		if (!e.ctrlKey && !e.shiftKey && !e.altKey && e.key === 'F10') {
			e.preventDefault();
			e.stopPropagation();
			run();
		}
	});
};
