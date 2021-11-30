import solve from './Support/solve.js';

const TRUE = {type: 'int', value: 1};
const FALSE = {type: 'int', value: 0};

export default async ({ a, b }) => {
    a = await solve(a);
	if (a.value === 1) {
		return TRUE;
	}
    b = await solve(b);
	return b.value === 1 ? TRUE : FALSE;
};
