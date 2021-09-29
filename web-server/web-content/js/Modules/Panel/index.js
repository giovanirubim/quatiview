import {
	CompilationError,
	ExecutionAborted,
	LexycalError,
	RuntimeError,
	SyntaticError,
} from '../errors.js';

import Net from '../Net.js';

let paused = true;
let running = false;
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
			Net.execution.abort();
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
		const { line, ch, lineContent } = Net.editor.getLineOf(index);
		Net.terminal.writeln(`${line.toString().padStart(4, ' ')} | ${lineContent}`);
		Net.terminal.writeln(`${' '.repeat(4)} |${' '.repeat(ch + 1)}^`);
		Net.editor.highlight(index, index);
	}
};

const step = async () => {
	Net.execution.handleStep();
};

const pause = async () => {
	if (paused) {
		return;
	}
	paused = true;
	button.pause.addClass('disabled');
	button.unpause.removeClass('disabled');
	button.next.removeClass('disabled');
	stopLoop();
};

let lastStep = null;
let intervalMs = 1000;
let intervalCode = null;
const startLoop = () => {
	if (intervalCode !== null) {
		return;
	}
	lastStep = Date.now();
	intervalCode = setInterval(() => {
		const now = Date.now();
		if (now - lastStep >= intervalMs) {
			step();
			lastStep = now;
		}
	}, 0);
};

const stopLoop = () => {
	if (intervalCode !== null) {
		clearInterval(intervalCode);
		intervalCode = null;
	}
};

const stop = () => {
	if (running) {
		Net.execution.abort();
	}
	Net.terminal.writeln('\nExecution aborted');
	handleEnd();
};

const handleEnd = () => {
	stopLoop();
	running = false;
	Net.editor.unlock();
	button.run.removeClass('disabled');
	button.stop.addClass('disabled');
	button.unpause.addClass('disabled');
	button.pause.addClass('disabled');
	button.next.addClass('disabled');
};

const handleStart = () => {
	running = true;
	paused = true;
	button.run.addClass('disabled');
	button.stop.removeClass('disabled');
	button.unpause.removeClass('disabled');
	button.next.removeClass('disabled');
	Net.editor.lock();
};

const unpause = async () => {
	if (!paused) {
		return;
	}
	paused = false;
	button.pause.removeClass('disabled');
	button.unpause.addClass('disabled');
	button.next.addClass('disabled');
	startLoop();
};

const run = async () => {
	Net.terminal.reset();
	Net.memViewer.clear();
	const source = Net.editor.getText();
	try {
		handleStart();
		await Net.interpreter.run(source);
		handleEnd();
		Net.terminal.writeln('\nProgram exited');
	} catch (error) {
		handleEnd();
		if (error instanceof CompilationError) {
			reportCompilationError(source, error);
		} else if (error instanceof RuntimeError) {
			reportRuntimeError(error);
		} else if (error instanceof ExecutionAborted) {
		} else {
			console.error(error);
		}
	}
};

const bindSpeedInput = () => {
	const input = $('.panel-speed input');
	const maxDelay = 2000;
	const pow = 3;
	const speedToDelay = (speed) => Math.pow(1 - speed, pow)*maxDelay;
	intervalMs = speedToDelay(input.val());
	input.on('input', () => {
		intervalMs = speedToDelay(input.val());
	});
};

const bindButton = (name, action) => {
	button[name].on('click', function(){
		if ($(this).hasClass('disabled')) {
			return;
		}
		action.call(this);
	});
};

export const init = () => {
	const buttons = $('#control-panel .panel-button');
	buttons.each(function() {
		const item = $(this);
		let id = item.attr('button-id');
		button[id] = item;
	});
	const inputFile = createInputFile();
	bindButton('upload', () => inputFile.trigger('click'));
	bindButton('run', run);
	bindButton('pause', pause);
	bindButton('unpause', unpause);
	bindButton('next', step);
	bindButton('stop', stop);
	bindSpeedInput();
	$(window).on('keydown', (e) => {
		if (!e.ctrlKey && !e.shiftKey && !e.altKey && e.key === 'F10') {
			e.preventDefault();
			e.stopPropagation();
			run();
		}
		if (!e.ctrlKey && !e.shiftKey && !e.altKey && /^(arrow)?right$/i.test(e.key)) {
			step();
		}
	});
};
