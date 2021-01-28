import SourceConsumer from './source-consumer.js'
import fs from 'fs'
const irrelevantRegex = /^(\s+|\/\*([^*]|\*[^/])*\*\/)+/
const source = fs.readFileSync('./huffman.c').toString('utf8')
const src = new SourceConsumer(source, irrelevantRegex)
const idRegex = /^[a-z_]\w*/i
const intRegex = /^([1-9]\d*|\d)\b/
const parseNumericType = () => {
	let unsigned = false
	let mainType = null
	if (src.consumeIfMatches(/^long\b/)) {
		if (src.consumeIfMatches(/^unsigned\b/)) {
			unsigned = true
		}
		mainType = 'long ' + src.consume(/^int\b/)
	} else {
		if (src.consumeIfMatches(/^unsigned\b/)) {
			unsigned = true
		}
		mainType = src.consume(/^(int|char)\b/)
	}
	return unsigned? `unsigned ${mainType}`: mainType
}
const parseStructDesc = () => {
	src.consume(/^struct\b/)
	let name = src.consumeIfMatches(idRegex)
	src.consume('{')
	let content = []
	while (!src.matches('}')) {
		content.push(parseVarDeclaration())
	}
	src.consume('}')
	return {type: 'struct-desc', content}
}
const parseId = () => {
	return src.consume(idRegex)
}
const parseVarDeclaration = () => {
	const type = parseType()
	let pointerDepth = 0
	while (src.consumeIfMatches('*')) {
		++ pointerDepth
	}
	const name = parseId()
	const indices = []
	while (src.consumeIfMatches('[')) {
		if (src.matches(intRegex)) {
			indices.push(src.consume(intRegex))
		} else {
			indices.push(src.consume(idRegex))
		}
		src.consume(']')
	}
	src.consume(';')
	return {type, pointerDepth, name, indices}
}
const parseInclude = () => {
	src.consume(/^#include\b/)
	let lib = src.consume(/^<\w+(\.\w+)?>/)
	return {
		type: 'include',
		lib: lib.replace(/^<|>$/g, '')
	}
}
const parseType = () => {
	if (src.matches(/^struct\b/)) {
		if (src.matches(/^struct(\s*\w+)?\s*{/)) {
			return parseStructDesc()
		}
		src.consume('struct')
		let structName = src.consume(idRegex)
		return `struct ${structName}`
	}
	if (src.matches(/^(int|long|unsigned|char)\b/)) {
		return parseNumericType()
	}
	return src.consume(idRegex)
}
const parseTypedef = () => {
	src.consume(/^typedef\b/)
	const type = parseType()
	const name = parseId()
	src.consume(';')
	return {type: 'typedef', content: type, name}
}
const parseDefine = () => {
	src.consume(/^#define\b/)
	let content = src.consume(/^([^\n\\]|\\(.|\s))*/)
	return {type: 'define', content}
}
const parseLine = () => {
	if (src.matches('#include')) {
		return parseInclude()
	}
	if (src.matches('#define')) {
		return parseDefine()
	}
	if (src.matches('typedef')) {
		return parseTypedef()
	}
	return parseVarDeclaration()
}
let line = null
while (!src.end()) {
	line = parseLine()
	console.log(JSON.stringify(line, null, '  '))
}
