import SourceConsumer from './source-consumer.js'
let source
const irrelevantRegex = /^(\s+|\/\*([^*]|\*[^/])*\*\/)+/

const mapHead = (pattern) => {
	const head = {}
	if (pattern instanceof RegExp) {
		for (let i=1; i<127; ++i) {
			const char = String.fromCharCode(i)
			if (pattern.test(char)) {
				head[char] = true
			}
		}
	} else {
		head[pattern[0]] = true
	}
	return head
}

class Match {
	constructor(head = {}, parse) {
		if (head instanceof RegExp || typeof head === 'string') {
			head = mapHead(head)
		}
		this.head = head
		this.parse = parse
	}
	mergeHead(...matches) {
		for (let match of matches) {
			const other = match.head
			const {head} = this
			for (let attr in other) {
				head[attr] = head[attr] || other[attr]
			}
		}
		return this
	}
	setParse(parse) {
		this.parse = parse
		return this
	}
	parseSafe() {
		const {index} = source
		try {
			return this.parse()
		} catch(err) {
			source.index = index
			return null
		}
	}
	matchHead() {
		return this.head[source.nextChar()] ?? false
	}
}

class Terminal extends Match {
	constructor(name, pattern, head_pattern) {
		if (typeof pattern === 'string') {
			head_pattern = pattern[0]
			pattern = new RegExp(pattern)
		}
		const regex = new RegExp(`^(${pattern.source})`, pattern.flags)
		const head = mapHead(head_pattern)
		const parse = () => {
			const {index} = source
			const content = source.consume(regex)
			const end = index + content.length
			return {type: name, index, end, content}
		}
		super(head, parse)
	}
}

const forkMatch = (...matches) => {
	const next = source.nextChar()
	for (let match of matches) {
		if (match.head[next]) {
			return match.parse()
		}
	}
	throw source.error()
}

const int = new Terminal('int', /\d+/, /\d/);
const id = new Terminal('id', /[\d_a-z]\w*/i, /[\d_a-z]/i);
const char = new Terminal('char', /'([^\s\\]|\x20|\\[^\s])'/, "'");
const string = new Terminal('string', /"([^"\n\\]|\\(.|\n))*"/, '"');
const nil = new Terminal('nil', 'NULL');
const ord_cmp = new Terminal('ord_cmp', /<=|>=|<|>/, /[<>]/)
const signed_type = new Terminal('signed_type', /char|int/, /[ci]/)
const asterisk = new Terminal('asterisk', /\*/, '*')
const semicolon = new Terminal('semicolon', ';')
const constant = new Match()
	.mergeHead(nil, int, char, string)
	.setParse(() => {
		const content = forkMatch(nil, int, char, string)
		return {
			type: 'constant',
			index: content.index,
			end: content.end,
			content
		}
	})

const int_type = new Match(/[uic]/, () => {
	const {index} = source
	const signed = !source.consumeIfMatches(/^unsigned\b/)
	const type = signed_type.parse()
	return {
		type: 'int_type',
		name: type.content,
		signed,
		index,
		end: type.end
	}
})

const raw_type = new Match()
	.setParse(() => int_type.parseSafe() ?? id.parse())
	.mergeHead(int, id)

const var_list = new Match(raw_type.head, () => {
	const {index} = source
	const type = raw_type.parse()
	const content = []
	for (;;) {
		content.push(var_item.parse())
		if (!source.consumeIfMatches(/^,/)) break
	}
	return {
		type: 'var_list',
		raw_type: type,
		content,
		index,
		end: content[content.length - 1].end
	}
})

const array_size = new Match('[', () => {
	source.consume('[')
	const expr = expr.parse()
	source.consume(']')
	return expr
})

const var_item = new Match()
	.mergeHead(asterisk, id)
	.setParse(() => {
		const {index} = source
		let nAsterisks = 0
		while (asterisk.parseSafe()) ++ nAsterisks;
		const name = id.parse()
		let arr = []
		for (;;) {
			if (!array_size.matchHead()) break
			arr.push(array_size.parse())
		}
		return {
			type: 'var_item',
			nAsterisks,
			name,
			index,
			end: arr[arr.length - 1]?.end ?? name.end
		}
	})

const var_def = new Match(var_list.head, () => {
	const content = var_list.parse()
	const end = semicolon.parse().end
	return {type: 'var_def', content, index: content.index, end}
})

const struct_def = new Match('s', () => {
	const {index} = source
	source.consume(/^struct\b/)
	let name = id.parse()
	source.consume(/^{/)
	let var_defs = []
	for (;;) {
		var_defs.push(var_def.parse())
		if (source.nextChar() === '}') break
	}
	const end = source.index + 1
	source.consume(/^}/)
	return {type: 'struct_def', name, var_defs, index, end}
})

export const parse = (str) => {
	source = new SourceConsumer(str, irrelevantRegex)
	return struct_def.parse()
}
