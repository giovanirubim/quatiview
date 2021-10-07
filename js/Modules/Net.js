import * as Editor from './Editor/index.js';
import * as Terminal from './Terminal/index.js';
import * as Panel from './Panel/index.js';
import * as Interpreter from './Interpreter/index.js';
import * as MemViewer from './MemViewer/index.js';
import * as Execution from './Execution/index.js';
import * as Memory from './Memory/index.js';

export default ({
    editor: Editor,
    terminal: Terminal,
    panel: Panel,
	interpreter: Interpreter,
	memory: Memory,
    memViewer: MemViewer,
    execution: Execution,
});
