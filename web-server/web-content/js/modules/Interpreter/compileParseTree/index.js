import TreeCompiler from './TreeCompiler.js';

import './ElementCompilers/compileProgram.js';
import './ElementCompilers/compileFunDec.js';

export default (tree) => TreeCompiler.compile(tree, {});
