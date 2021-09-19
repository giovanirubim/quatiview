const http = require('http');
const path = require('path');
const fs = require('fs');
const mimeMap = {
	'js': 'application/javascript',
	'css': 'text/css',
	'html': 'text/html',
	'jpeg': 'image/jpeg', 'jpg': 'image/jpeg', 'png': 'image/png',
};
const port = process.env.PORT || 80;
const getMime = (path) => mimeMap[path.replace(/.*\.(\w+)/, '$1')];
http.createServer((req, res) => {
	let urlpath = req.url
		.replace(/[?#].*$/, '');
	try {
		if (urlpath.endsWith('/')) {
			const jspathname = path.join(__dirname, 'web-content', urlpath, 'index.js');
			console.log(jspathname);
			if (fs.existsSync(jspathname)) {
				urlpath += 'index.js';
			} else {
				urlpath += 'index.html';
			}
		}
		const pathname = path.join(__dirname, 'web-content', urlpath);
		if (!fs.existsSync(pathname)) {
			res.writeHead(404);
			res.end();
			return;
		}
		if (fs.lstatSync(pathname).isDirectory()) {
			res.writeHead(301, {
				'location': urlpath + '/',
			});
			res.end();
			return;
		}
		const buffer = fs.readFileSync(pathname);
		res.writeHead(200, {
			'content-type': getMime(urlpath) ?? 'application/octet-stream',
			'content-length': buffer.length,
		});
		res.write(buffer);
		res.end();
	} catch(err) {
		res.writeHead(500);
		res.end();
	}
}).listen(port, '0.0.0.0', () => {
	console.log(`Server started: http://localhost:${port}`);
});