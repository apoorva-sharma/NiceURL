var port = process.env.PORT || 5000;
var app = require('http').createServer(handler).listen(port)
  , fs = require('fs')
  , url = require('url');

// objects to help with frequency analysis
var frequencytracker = require('./frequencytracker');
var priqueue = require('./priorityqueue');

// to run Goose, which parses incoming text
var exec = require('child_process');

// handles requests sent to the server
function handler (req, res) {
  var path =  url.parse(req.url).pathname;
  // ajax request
  if (path == '/process') {
  	var query = url.parse(req.url).query;
    res.writeHead(200);
  	getURLText(query,res);
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

// gets the text from the url
// query: encoded url to pass
// res: response to write back
function getURLText(query, res) {
  console.log("getting URL text for ");
  var url = decodeURIComponent(query);
  console.log(url);
  goosecmd = makeGooseCommand(url);
  exec.exec(goosecmd, {cwd: 'Goose/goose'},
    function(error, stdout, stderr) {
      processText(error, stdout, res);
    }
  );
}

// returns a command to run that calls goose on the passed url
function makeGooseCommand(url) {
  var command = "mvn exec:java -Dexec.mainClass=com.gravity.goose.TalkToMeGoose -Dexec.args=\"";
  command += url;
  command += "\" -e -q";
  return command;
}

// processes text to generate keywords
function processText(err, text, res) {
  if (err) {
    res.end("error");
    console.log(err);
    return
  }
  // debug stuff
  console.log("called processText with text")
  console.log(text);

  // create a frequency tracker
  var tracker = new frequencytracker.FrequencyTracker();
  // add in all the words from the text
  var words = text.split(" ");
  for (word in words) {
    tracker.push(words[word]);
  }

  // create a PriorityQueue to find the 10 highest frequency words
  var heap = new priqueue.PriorityQueue(function(elem) {
    return -elem.frequency; // so the lowest score is the highest frequency
  });

  // add all the words in the tracker to the heap
  tracker.getFrequencies().forEach(heap.push, heap);

  //console.log(heap.content);

  // a string of keywords:
  var keywords = "";
  for(var i = 0; i < 10; i++) {
    keywords += heap.pop().word;
  }

  res.end(keywords);
}