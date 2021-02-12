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
		type = 'id'
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
const bnfLineToDOM = (src) => {
	const div = $(document.createElement('div'))
	div.html('<div class="line" tabindex="0">'
		+ [...src.matchAll(tokenRegex)]
			.map(match => match[0])
			.map(toSpan)
			.join('')
		+ '</div>')
	const line = div.children().first()
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
const check = () => {
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
$(document).ready(() => {
	main = $('#main')
	$('form').on('submit', () => false)
	$('body').on('focus', '.line', function(){
		const line = $(this)
		const input = createInput(line.text())
		line.replaceWith(input)
		input.trigger('focus')
	})
	$.get('/bnf.txt').then(setSrc)
})
