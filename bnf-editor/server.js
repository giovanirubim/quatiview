let Path = require('path')
let http = require('http')
let fs = require('fs')
let filePath = Path.join(__dirname, 'bnf.txt')
let port = 9137
const mimeMap = {
	'html': 'text/html',
	'js': 'application/javascript',
	'txt': 'text/plain',
	'css': 'text/css',
}
const getMime = (path) => {
	return mimeMap[path.replace(/^.*\.(\w+)$/, '$1')] || 'application/octet-stream'
}
http.createServer((req, res) => {
	let {url, method} = req
	let path = Path.join(__dirname, url.replace(/[?#].*/, '').replace(/\/$/, '/index.html'))
	if (method === 'GET') {
		try {
			const buffer = fs.readFileSync(path)
			res.writeHead(200, {
				'content-type': getMime(path),
				'content-length': buffer.length
			})
			res.end(buffer)
		} catch(err) {
			res.writeHead(404)
			res.end()
		}
		return
	}
	if (method !== 'POST') {
		res.writeHead(404)
		res.end()
	}
	const chunks = []
	req.on('data', chunk => chunks.push(chunk))
	req.on('end', () => {
		const str = Buffer.concat(chunks)
			.toString('utf8')
			.replace(/\r/g, '')
		fs.writeFileSync(filePath, str)
		res.writeHead(200)
		res.end()
	})
}).listen(port, () => {
	console.log(`http://localhost:${port}/`)
})