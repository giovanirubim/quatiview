import oneOf from './oneOf.js';

import parseFunDec from './parseFunDec.js';
import parseStructDec from './parseStructDec.js';
import parseVarDec from './parseVarDec.js';

export default (tokenGenerator) => oneOf(
    tokenGenerator,
    parseFunDec,
    parseVarDec,
    parseStructDec,
);
