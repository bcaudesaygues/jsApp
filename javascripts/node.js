var http = require('http'),
    fs = require('fs');
   
http.createServer(function(req, res) {
  if(req.url == "/" || req.url == "/index.html") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('index.html'));

  // app
  } else if(req.url.match("/javascripts/*")) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(fs.readFileSync(req.url.substr(1)));
  // data
  } else if(req.url == "/data.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('data/data.js'));
  // Companies
  } else if(req.url == "/companies.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('data/companies.js'));
  // Processes
  } else if(req.url == "/processes.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('data/processes.js'));
  // Users
  } else if(req.url == "/users.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('data/users.js'));
  // Tasks
  } else if(req.url == "/tasks.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('data/tasks.js'));
  // Steps
  } else if(req.url == "/steps.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('data/steps.js'));
  // Underscore
  } else if(req.url == "/javascripts/underscore.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('javascripts/underscore.js'));
  // toJson
  } else if(req.url == "/javascripts/tojson.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('javascripts/tojson.js'));
  // Store
  } else if(req.url == "/javascripts/store.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('javascripts/store.js'));
  // JQuery
  } else if(req.url == "/javascripts/jquery.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('javascripts/jquery.js'));
  // JSON2
  } else if(req.url == "/javascripts/json2.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('javascripts/json2.js'));
  // MustacheJS
  } else if(req.url == "/javascripts/mustache.js") {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(fs.readFileSync('javascripts/mustache.js'));
  // CSS
  } else if(req.url == "/stylesheets/main.css") {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end(fs.readFileSync('stylesheets/main.css'));
  // 404
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("Page Could Not Be Found");
  }
}).listen("31606");
