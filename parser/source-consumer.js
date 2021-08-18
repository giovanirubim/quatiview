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
		return this.remaining[0] ?? ''
	}
	matches(regex) {
		return regex.test(this.remaining)
	}
	consumeIfMatches(regex) {
		const match = this.remaining.match(regex)
		if (match === null) {
			return null
		}
		const result = match[0]
		this.skip(result.length)
		this.skipIrrelevant()
		return result
	}
	consume(regex) {
		const result = this.consumeIfMatches(regex)
		if (result === null) {
			throw this.error()
		}
		return result
	}
}

export default SourceConsumer
