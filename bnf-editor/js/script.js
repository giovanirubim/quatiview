let main
const getSrc = () => {
	let src = '';
	main.children().each(function() {
		const child = $(this)
		if (child.is('input')) {
			src += child.val().trim() + '\n'
		} else {
			src += child.text().trim() + '\n'
		}
	})
	return src
}
const store = () => {
	$.post({
		url: '/',
		processData: false,
		data: getSrc()
	})
	check()
}
const parseLine = (line) => {
	let tokens = toTokenList(line).filter((token) => /[^\s]/.test(token))
	let next = () => tokens[0] || ''
	let pop = () => tokens.splice(0, 1)[0]
	let abort = () => {throw new Error()}
	let tabs = ''
	let tab = '|  '
	let callMap = {}
	let logs = false
	let log = (msg) => {
		if (logs) console.log(msg)
	}
	let addToMap = (name) => {
		let {length} = tokens
		let key = name + ':' + length
		if (callMap[key]) {
			log('loop detected in ' + name)
			abort()
		}
		callMap[key] = true
	}
	let call = (fn) => {
		let {name} = fn
		log(tabs + name + ' { // tokens: ' + tokens.join('').substr(0, 16))
		addToMap(name)
		tabs += tab
		let ret = fn()
		tabs = tabs.substr(tab.length)
		log(tabs + '} // tokens: ' + tokens.join('').substr(0, 16))
		return ret
	}
	let popTerminal = () => {
		if (!next().match(/^['/]/)) abort()
		return {type: 'terminal', content: pop()}
	}
	let popOptional = () => {
		if (pop() !== '[') abort()
		let content = call(popExpr)
		if (pop() !== ']') abort()
		return {type: 'optional', content}
	}
	let popId = () => {
		if (!next().match(/^\w+$/)) abort()
		return {type: 'id', content: pop()}
	}
	let popWrappedExpr = () => {
		if (pop() !== '(') abort()
		let content = call(popExpr)
		if (pop() !== ')') abort()
		return content
	}
	let popAtom = () => {
		if (next() === '[') return call(popOptional)
		if (next().match(/^['/]/)) return call(popTerminal)
		if (next() === '(') return call(popWrappedExpr)
		return call(popId)
	}
	let popItem = () => {
		let atom = call(popAtom)
		if (next().match(/^[*+]$/)) {
			return {type: pop(), content: atom}
		}
		return atom
	}
	let popConcat = () => {
		let content = [call(popItem)]
		while (tokens.length) {
			if (next().match(/^[)\]|]/)) break
			content.push(call(popItem))
		}
		if (content.length === 1) return content[0]
		return {type: 'concat', content}
	}
	let popExpr = () => {
		let content = [call(popConcat)]
		while (tokens.length && !next().match(/^[\])]$/)) {
			if (pop() !== '|') abort()
			content.push(call(popConcat))
		}
		if (content.length === 1) return content[0]
		return {type: 'fork', content}
	}
	let popLine = () => {
		let id = call(popId)
		if (pop() !== '::=') abort()
		let content = call(popExpr)
		if (tokens.length) abort()
		return {name: id.content, content}
	}
	return call(popLine)
}
let translate = (str) => {
	let res = ''
	for (let char of str) {
		if (str === '&') {
			res += '&amp;'
		} else if (str === '<') {
			res += '&lt;'
		} else if (str === '>') {
			res += '&gt;'
		} else {
			res += char
		}
	}
	return res
}
let toSpan = (text) => {
	if (text.match(/^\s+$/)) return '<span> </span>'
	let type
	if (text[0] === '\'') {
		type = 'string'
	} else if (text.match(/^\/./)) {
		type = 'regex'
	} else if (text.match(/[\*\+]/)) {
		type = 'asterisk'
	} else if (text === '|') {
		type = 'or'
	} else if (text === '::=') {
		type = 'desc'
	} else if (text.match(/[\[\]]/)) {
		type = 'optional'
	} else if (text.match(/[\(\)]/)) {
		type = 'bracket'
	} else if (text.match(/^\w+$/)) {
		type = 'id" name="' + text
	} else {
		type = 'unknown'
	}
	return `<span class="${type}">${translate(text)}</span>`
}
const bindInput = (input) => {
	let solved = false
	const solve = () => {
		if (solved) return null
		solved = true
		const value = input.val().trim()
		if (!value) {
			input.remove()
			store()
			return null
		}
		const line = bnfLineToDOM(value)
		input.replaceWith(line)
		store()
		return line
	}
	input.on('keydown', (e) => {
		if (e.key === 'Enter') {
			const line = solve()
			if (!line) return
			const next = line.next()
			const input = createInput()
			main.append(input)
			if (next) {
				input.insertBefore(next)
			}
			input.trigger('focus')
		}
		if (e.key === 'Escape') {
			solve()
		}
	})
	input.on('blur', solve)
}
const tokenRegex = /(::=|\s+|'([^\\']|\\.)*'|\w+|\/([^\\\/]|\\.)*\/[a-z]*|.)/g
const toTokenList = (str) => {
	const matches = [...str.matchAll(tokenRegex)]
	return matches.map((match) => match[0])
}
const bnfLineToDOM = (src) => {
	const div = $(document.createElement('div'))
	div.html(
		'<div class="line" tabindex="0">' +
			toTokenList(src).map(toSpan).join('') +
		'</div>'
	)
	const line = div.children()
	const ids = line.find('span.id')
	ids.not(':first').addClass('instance')
	ids.first().addClass('def')
	return line
}
const createInput = (value = '') => {
	const input = $(document.createElement('input'))
	bindInput(input.attr('type', 'text').val(value))
	return input
}
const setSrc = (src) => {
	src.trim()
		.replace(/\s*\n\s*/g, '\n')
		.split('\n')
		.forEach((line) => main.append(bnfLineToDOM(line)))
	check()
}
const checkUsage = () => {
	let src = getSrc()
	let defined = {}
	src.trim().split('\n').forEach(line => {
		defined[line.split('::=')[0].trim()] = true
	})
	$('span').each(function(){
		const span = $(this)
		if (!span.hasClass('id')) return
		const id = span.text()
		if (!defined[id]) {
			span.addClass('undefined')
		} else {
			span.removeClass('undefined')
		}
	})
}
const checkSyntax = () => {
	let map = {}
	$('.line,input[type="text"]').each(function(){
		const item = $(this).removeClass('error')
		let line = item.is('input')? item.val(): item.text().trim()
		if (!line) return
		let parsed
		try {
			parsed = parseLine(line)
		} catch(err) {
			item.addClass('error')
			return
		}
		map[parsed.name] = parsed.content
	})
}
const check = () => {
	checkUsage()
	checkSyntax()
}
$(document).ready(() => {
	main = $('#main')
	$('form').on('submit', () => false)
	$('body').on('focus', '.line', function(){
		const line = $(this)
		const input = createInput(line.text())
		line.replaceWith(input)
		input.trigger('focus')
	})
	main.on('mouseover', 'span.id', (e) => {
		if (!e.shiftKey && !e.altKey) return
		const target = $(e.target ?? e.srcElement)
		const name = target.attr('name')
		if (target.hasClass('def')) {
			$(`span[name="${name}"].instance`).addClass('highlight')
		} else {
			$(`span[name="${name}"].def`).addClass('highlight')
		}
	})
	main.on('mouseout', 'span.id', (e) => {
		$('span.highlight').removeClass('highlight')
	})
	$.get('/bnf.txt').then(setSrc)
})
