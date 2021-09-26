const arg = { name: 'addr', type: 'void*', size: 4, addr: [] };
export default {
    name: 'free',
    returnType: 'void',
    args: [ arg ],
    run: { instruction: 'free', arg },
};
