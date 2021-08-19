const list = `

	CONSTANT

`;

module.exports = Object.fromEntries(
	list
		.trim()
		.split(/\s*\n\s*/)
		.map((name) => [ name, `NT-${name}` ]),
);
