var port = process.env.PORT || 5000;
var app = require('http').createServer(handler).listen(port)
  , fs = require('fs')
  , url = require('url')
  , Boilerpipe = require('boilerpipe');

var boilerpipe = new Boilerpipe();

// handles requests sent to the server
function handler (req, res) {
  var path =  url.parse(req.url).pathname;
  // ajax request
  if (path == '/process') {
  	var query = url.parse(req.url).query;
  	var output = makeNiceURL(query);
  	res.writeHead(200);
    res.end(output);
  } else if (path == '/') { // mainpage
  	fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading');
        }
        res.writeHead(200);
        res.end(data);
      });
  } else { // wrong
  	fs.readFile(__dirname + path,
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading');
        }
        res.writeHead(200);
        res.end(data);
      });
  }
}

// makes the URL Nice
function makeNiceURL (query) {
	return "nice nice " + decodeURIComponent(query);
}