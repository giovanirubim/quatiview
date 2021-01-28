class SourceConsumer {
	constructor(sourceCode, irrelevantRegex) {
		this.fullSource = sourceCode
		this.remaining = sourceCode
		this.irrelevantRegex = irrelevantRegex
		this.skipIrrelevant()
	}
	get index() {
		return this.fullSource.length - this.remaining.length
	}
	set index(index) {
		this.remaining = this.fullSource.substr(index)
	}
	end() {
		return this.remaining.length === 0
	}
	error() {
		const {index} = this
		let a = Math.max(0, index - 15)
		let b = Math.min(index + 15, this.fullSource.length)
		const near = this.fullSource.substring(a, b)
		const error = new SyntaxError(`Syntatic error at position ${index}, near: ${near}`)
		error.index = index
		return error
	}
	skip(nChars) {
		this.remaining = this.remaining.substr(nChars)
	}
	skipIrrelevant() {
		const {irrelevantRegex} = this
		if (irrelevantRegex == null) return
		this.remaining = this.remaining.replace(irrelevantRegex, '')
	}
	nextChar() {
		return this.remaining[0]
	}
	matches(pattern) {
		if (pattern instanceof RegExp) {
			return pattern.test(this.remaining)
		}
		return this.remaining.startsWith(pattern)
	}
	consumeIfMatches(pattern) {
		if (pattern instanceof RegExp) {
			const match = this.remaining.match(pattern)
			if (match === null) {
				return null
			}
			const result = match[0]
			this.skip(result.length)
			this.skipIrrelevant()
			return result
		}
		if (!this.remaining.startsWith(pattern)) {
			return null
		}
		this.skip(pattern.length)
		this.skipIrrelevant()
		return pattern
	}
	consume(pattern) {
		const result = this.consumeIfMatches(pattern)
		if (result === null) {
			throw this.error()
		}
		return result
	}
}

export default SourceConsumer
