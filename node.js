var http = require('http'),
    fs = require('fs');
   
http.createServer(function(req, res) {
  if(req.url == "/" || req.url == "/index.html") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('index.html'));
  } else if(req.url == "/javascripts/app.js") {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(fs.readFileSync('javascripts/app.js'));
  } else if(req.url == "/javascripts/jquery.js") {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(fs.readFileSync('javascripts/jquery.js'));
  } else if(req.url == "/javascripts/json2.js") {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(fs.readFileSync('javascripts/json2.js'));
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("Page Could Not Be Found");
  }
}).listen(process.env.PORT, "127.0.0.1");