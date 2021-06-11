import TokenGenerator from './TokenGenerator.mjs';

const sample = `
for (int i=0; i<10; i+=1) {
	j = j + x;
}
char str[10];
y = y - 15 - x*10 + (z%w - k/p);
a(object->attr + 4.5 + var.n);
chr = 'k';
chr = '\\n';
print("this is a string", '\\0');
array[x] = 95;
if (x >= 10 || y == z || n <= p && a != 1) {
	return (0);
}
`;

const generator = TokenGenerator(sample);
const tokens = [ ...generator ];
const lines = tokens.map((match) => {
	return `${match.type.name}: [${match.content}]`;
});
console.log(lines.join('\n'));
