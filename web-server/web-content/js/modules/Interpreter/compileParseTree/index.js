import TreeCompiler from './TreeCompiler.js';

import './ElementCompilers/compileFunDec.js';
import './ElementCompilers/compileLocalLine.js';
import './ElementCompilers/compileProgram.js';
import './ElementCompilers/compileScope.js';
import './ElementCompilers/compileVarDec.js';

export default (tree) => TreeCompiler.compile(tree, {});
