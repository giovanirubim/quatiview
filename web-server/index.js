const http = require('http');
const path = require('path');
const fs = require('fs');
const mimeMap = {
	'js': 'application/javascript',
	'css': 'text/css',
	'html': 'text/html',
	'jpeg': 'image/jpeg', 'jpg': 'image/jpeg', 'png': 'image/png',
};
const getMime = (path) => mimeMap[path.replace(/.*\.(\w+)/, '$1')];
http.createServer((req, res) => {
	let urlpath = req.url
		.replace(/[?#].*$/, '')
		.replace(/\/$/, '/index.html');
	try {
		const pathname = path.join(__dirname, 'web-content', urlpath);
		const buffer = fs.readFileSync(pathname);
		res.writeHead(200, {
			'content-type': getMime(urlpath) ?? 'application/octet-stream',
			'content-length': buffer.length,
		});
		res.write(buffer);
		res.end();
	} catch(err) {
		res.writeHead(404);
		res.end();
	}
}).listen(80, '0.0.0.0', () => {
	console.log('Server started');
});