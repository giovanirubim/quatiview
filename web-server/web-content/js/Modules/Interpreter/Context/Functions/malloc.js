const arg = { name: 'size', type: 'int', size: 4, addr: [] };
export default {
    name: 'malloc',
    returnType: 'void*',
    args: [ arg ],
    run: { instruction: 'malloc', arg },
};
