const path = require('path');
const webDir = path.join(__dirname, '/web-content/');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(webDir))
app.use((req, res, next) => {
	console.log(`Not found: ${req.url}`);
	next();
});
app.listen(port, '0.0.0.0', () => {
	console.log(`Server started: http://localhost:${port}`);
});
