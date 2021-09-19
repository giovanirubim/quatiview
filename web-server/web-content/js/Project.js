import * as Editor from './Modules/Editor';
import * as MemViewer from './Modules/MemViewer';
import * as Panel from './Modules/Panel';
import Terminal from './Modules/Terminal';
import Interpreter from './Modules/Interpreter';
import Memory from './Modules/Memory';

const project = {
	editor: Editor,
	memViewer: MemViewer,
	terminal: Terminal,
	interpreter: Interpreter,
	panel: Panel,
	memory: Memory,
};

export default project;
