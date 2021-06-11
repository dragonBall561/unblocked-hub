const http = require('http'),
    https = require('https'),
    fs = require('fs'),
    config = require('./serverconfig.json'),
    port = config.port,
    ip = config.ip,
    index_file = 'index.html',
    
	app = (req, res) => {
		req.pathname = req.url.split('#')[0].split('?')[0];
		const publicPath = __dirname + '/public' + req.pathname;

		const error = () => (res.statusCode = 404, res.end(fs.readFileSync(__dirname + '/lib/error.html', 'utf-8').replace('%ERR%', `Cannot ${req.method} ${req.pathname}`)))

		fs.lstat(publicPath, (err, stats) => {
			if (err) return error();

			if (stats.isDirectory()) fs.existsSync(publicPath + index_file) ? fs.createReadStream(publicPath + index_file).pipe(res) : error();
			else if (stats.isFile()) !publicPath.endsWith('/') ? fs.createReadStream(publicPath).pipe(res) : error();
			else error();
      	});
    },

    server = http.createServer(app);

server.listen(process.env.PORT || port, ip)
console.log(`Listening at https://${ip}:${port}`)