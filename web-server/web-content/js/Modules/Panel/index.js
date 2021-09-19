import { CompilationError, LexycalError, SyntaticError } from "../../errors.js";
import getLineOf from "./Support/getLineOf.js";
import project from '../../Project.js';

let button = {};
let uploadHandlers = [];
const {
	editor,
	terminal,
	interpreter,
} = project;

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

const reportCompilationError = (source, error) => {
	terminal.writeln('Compilation failed');
	const { index } = error;
	if (index === source.length) {
		terminal.writeln('Unexpected end of file');
		return;
	}
	if (error instanceof SyntaticError) {
		terminal.writeln(`Syntax error: ${error.message}`);
	} else if (error instanceof LexycalError) {
		terminal.writeln(`Unrecognized token`);
	} else {
		terminal.writeln(`Error: ${error.message}`);
	}
	if (index != null) {
		const { line, lineCount, pos } = getLineOf(source, index);
		terminal.writeln(`${lineCount.toString().padStart(4, ' ')} | ${line}`);
		terminal.writeln(`${' '.repeat(4)} |${' '.repeat(pos)}^`);
	}
};

let execution = {
	paused: true,
	done: true,
	gen: null,
	waitingStep: false,
};

export const step = async () => {
	if (!execution.waitingStep) {
		return false;
	}
	execution.waitingStep = false;
	const { done } = await execution.gen.next();
	if (!done) {
		execution.waitingStep = true;
	} else {
		execution.done = true;
		execution.waitingStep = false;
		execution.gen = null;
		project.terminal.writeln('Program exited');
	}
	return true;
};

const start = async () => {
	while (!execution.done && !execution.paused) {
		await step();
	}
};

const run = async () => {
	terminal.clear();
	const source = editor.getText();
	try {
		const compiled = interpreter.compile(source);
		execution.gen = compiled.execute(compiled);
		execution.done = false;
		execution.waitingStep = true;
		await start();
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
	button.iniciar.on('click', run);
	button.avancar.on('click', step);
};

export const onupload = (handler) => {
	uploadHandlers.push(handler);
};

let inputHandler = null;

export const triggerInput = () => {
	inputHandler?.();
};

export const inputEvent = () => {
	return new Promise((done) => {
		inputHandler = done;
	});
};
