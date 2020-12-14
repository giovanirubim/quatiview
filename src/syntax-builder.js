/*
 * Este módulo é destinado a realização de análises sintáticas e geração de árvores sintáticas a
 * partir apenas de uma descrição relativamente simples da sintaxe de uma linguagem e de um código
 * fonte escrito nesta linguagem
 * Os caracteres " ", "\t", "\n" e "\r" são considerados espaçamento e ignorados entre tokens
 */

// Mapa auxiliar para identificar caracteres de espaçamento
const isSpace = {
	' ': true,
	'\t': true,
	'\n': true,
	'\r': true,
};

/*
 * Estrutura que codifica a ocorrência de um elemento sintático no código fonte
 * srcIt => Object: Referência do SourceIterator
 * index => Number: Índice da ocorrência deste elemento sintático
 * type => Instância de SyntaticElement que define o elemento da ocorrência
 * content => String | Match[]: No caso de String é o texto da ocorrência do elemento sintático, no
 caso de Array são os elementos que compõem o elemento sintático
 */
class Match {

	constructor(srcIt, index, type, content) {
		this.srcIt = srcIt;
		this.index = index;
		this.content = content;
		this.type = type;
		let length = 0;
		if (typeof content === 'string') {
			length = content.length;
		} else if (content.length === 0) {
			length = 0;
		} else {
			const first = content[0];
			const last = content[content.length - 1];
			length = last.index + last.length - first.index;
		}
		this.length = length;
	}

	srcString() {
		return this.srcIt.src.substr(this.index, this.length);
	}

	toString(nTabs = 0) {
		let res = '';
		const tabs = '\t'.repeat(nTabs);
		if (this.type instanceof Token) {
			return tabs + `Token(${JSON.stringify(this.srcString())})`;
		}
		const content = this.content
		if (!content.length) {
			return tabs + '[]';
		}
		res += tabs + '[\n'
		for (let i=0; i<content.length; ++i) {
			res += content[i].toString(nTabs + 1);
			if (i < content.length - 1) {
				res += ',';
			}
			res += '\n';
		}
		return res + tabs + ']';
	}
}

/*
 * Erro sintático
 */
class SyntaticError extends Error {
	constructor(srcIt, index) {
		if (index === srcIt.length) {
			super('Unexpected end of source ');
		} else {
			const char = srcIt.src[index];
			super(`Unexpected token ${char} at position ${index}`);
		}
	}
}

/*
 * Estrutura utilizada para consumir um código fonte
 */
class SourceIterator {

	constructor(src) {

		// Código fonte completo
		this.src = src;

		// Índice do próximo caractere a ser processado
		this.index = 0;

		// Restante ainda não processado do código
		this.buffer = src;

		// Comprimento do código fonte completo
		this.length = src.length;

		this.skipSpaces();

	}

	// Retorna uma cópia do estado atual
	get state() {
		return this.index;
	}

	// Define o estado atual
	set state(state) {
		this.index = state;
	}

	// Consome n caracteres do código fonte
	consume(n) {
		const { buffer } = this;
		const res = buffer.substr(0, n);
		this.buffer = buffer.substr(n);
		this.index += n;
		return res;
	}

	// Método de parsing para tokens
	// Retorna um Match do token
	parseToken(token) {
		const { index } = this;
		const length = token.matches(this.buffer);
		if (!length) {
			throw new SyntaticError(this, index);
		}
		const content = this.consume(length);
		this.skipSpaces();
		return new Match(this, index, token, content);
	}

	skipSpaces() {
		const { buffer } = this;
		let i = 0;
		while (isSpace[buffer[i]]) {
			++ i;
		}
		this.index += i;
		this.buffer = buffer.substr(i);
		return this;
	}

}

/*
 * Classe abstrata de elemento sintático
 * Instâncias de SyntaticElement representam definições de terminais e não terminais
 */
class SyntaticElement {
	constructor(name) {
		this.name = name;
	}
}

/*
 * Elemento sintático Token
 * Na geração da árvore sintática os tokens limitarão a profundidade da árvore
 * matches => Function(String): Retorna um inteiro > 0 com a quantidade de caracteres que batem com
 o padrão do token
 */
class Token extends SyntaticElement {

	constructor(pattern, name = pattern.toString()) {

		super(name);

		if (pattern instanceof RegExp) {

			const [, strRegex, flags] = pattern.toString().match(/^\/(.*)\/(\w+)?$/);
			const regex = new RegExp(`^(${ strRegex })`, flags);

			this.matches = (string) => {
				const match = string.match(regex);
				return match === null? null: match[0].length;
			};

		} else {

			const { length } = pattern;
			this.matches = (string) => string.startsWith(pattern)? length: null;
		}
	}

	parse(srcIt) {
		return srcIt.parseToken(this);
	}
}

/*
 * Elemento de construção sintática
 */
class Combination extends SyntaticElement {
	
	constructor(content) {
		super();
		this.content = content;
	}
	
	// Substitui todas as referências de não terminais de determinado nome pelo um não terminal
	replace(name, nonTerminal) {
		const { content } = this;
		if (!(content instanceof Array)) {
			return this;
		}
		const { length } = content;
		for (let i=0; i<length; ++i) {
			const item = content[i];
			if (item instanceof Combination) {
				item.replace(name, nonTerminal);
				continue;
			}
			if (item instanceof NonTerminalReference && item.name === name) {
				content[i] = nonTerminal;
			}
		}
		return this;
	}
}

/*
 * Representa uma referência a um não terminal
 */
class NonTerminalReference {
	constructor(name) {
		this.name = name;
	}
}

// Retorna o erro de maior profundidade
function deepestError(err1, err2) {
	if (!err1) return err2;
	if (!err2) return err1;
	return err1.index >= err2.index? err1: err2;
}

const prepareArg = (arg) => {
	if (typeof arg === 'string' || arg instanceof RegExp) {
		return new Token(arg);
	}
	if (arg instanceof Array) {
		if (arg.length === 1) {
			return prepareArg(arg[0]);
		}
		const content = [];
		for (let item of arg) {
			content.push(prepareArg(item));
		}
		return new Sequence(content);
	}
	return arg;
};

const prepareArgs = (args) => args.map(prepareArg);

/*
 * Elemento de construção sintática que represnta a possibilidade de um elemento sintático dentre um
 um conjunto de vários elementos sintáticos
 * O parsing deste objeto retorna o parsing do primeiro item de seu conteúdo que for bem sucedido
 */
class OneOf extends Combination {
	constructor(content) {
		super(content);
	}
	parse(srcIt, type = this) {
		const { state } = srcIt;
		let error;
		for (let item of this.content) {
			try {
				return item.parse(srcIt, type);
			} catch(err) {
				srcIt.state = state;
				error = deepestError(error, err);
			}
		}
		throw error;
	}
}

class Sequence extends Combination {
	constructor(content) {
		super(content);
	}
	parse(srcIt, type = this) {
		const { index } = srcIt;
		const content = [];
		for (let item of this.content) {
			const match = item.parse(srcIt);
			if (match) {
				content.push(match);
			}
		}
		return new Match(srcIt, index, type, content);
	}
}

class Optional extends Combination {
	constructor(content) {
		super(content);
	}
	parse(srcIt, type = this) {
		const { state } = srcIt;
		let res = null;
		try {
			res = this.content.parse(srcIt, type);
		} catch(err) {
			srcIt.state = state;
		}
		return res;
	}
}

const pushNotNull = (array, item) => {
	if (item !== null) {
		array.push(item);
	}
};

class List extends Combination {
	constructor({ item, separator }) {
		super([ item, separator ]);
		this.item = item;
		this.separator = separator;
	}
	parse(srcIt, type = this) {
		const { item, separator } = this;
		const { index } = srcIt;
		const content = [];
		for (;;) {
			pushNotNull(content, item.parse(srcIt));
			const { state } = srcIt;
			try {
				pushNotNull(content, separator.parse(srcIt));
			} catch(err) {
				srcIt.state = state;
				break;
			}
		}
		return new Match(srcIt, index, type, content);
	}
}

const nt = (name) => new NonTerminalReference(name);
const oneOf = (...args) => new OneOf(prepareArgs(args));
const sequence = (...args) => new Sequence(prepareArgs(args));
const optional = (...args) => new Optional(prepareArg(args));
const list = ({ item, separator }) => new List({
	item: prepareArg(item),
	separator: prepareArg(separator),
});
