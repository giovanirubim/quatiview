const arg = { name: 'chr', type: 'char', size: 1, addr: [] };
export default {
    name: 'putchar',
    returnType: 'void',
    args: [ arg ],
    run: { instruction: 'putchar', arg },
};
