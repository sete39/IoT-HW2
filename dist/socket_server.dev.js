"use strict";

var net = require('net'); // simple HTTP server using TCP sockets


var fs = require('fs');

var locations = {}; // current latitude, current longitude, destination latitude, destination longitude

function parsePOSTRequest(req) {
  // returns the request's body as a JSON
  var bodyIndex = r.indexOf("\n\r");
  var reqBody = r.substring(bodyIndex + 3, r.length);
  var keyIndex = 0;
  var equalIndex = 0;
  var ampersandIndex = 0;
  var isDone = false;
  var parsedRespJSON = {};

  while (!isDone) {
    equalIndex = reqBody.indexOf('=', equalIndex + 1);
    ampersandIndex = reqBody.indexOf('&', ampersandIndex + 1);
    var key = reqBody.substring(keyIndex, equalIndex);
    var value = void 0;

    if (ampersandIndex == -1) {
      // take from last '=' character till end of string if last one, do not use ampersand index
      value = reqBody.substring(equalIndex + 1, req.length);
      isDone = true; // exit the loop since we are done parsing
    } else {
      key = reqBody.substring(keyIndex, equalIndex); // bet. prev ampersand and equal we have the key

      keyIndex = ampersandIndex + 1;
      value = reqBody.substring(equalIndex + 1, ampersandIndex); // bet. equal and ampersand we have value
    }

    parsedRespJSON[key] = value;
  }

  return parsedRespJSON;
}

var server = net.createServer(function (socket) {
  socket.on('data', function (data) {
    //console.log('Received: ' + data);
    r = data.toString(); // console.log(r);

    if (r.substring(0, 12) == "GET /compass") {
      console.log('OK');
      socket.write("HTTP/1.1 200 OK\n");
      fs.readFile('compass.html', 'utf8', function (err, contents) {
        socket.write("Content-Length:" + contents.length);
        socket.write("\n\n"); // two carriage returns

        socket.write(contents);
      });
    } else if (r.substring(0, 14) == "GET /locations") {
      console.log('sending locations');
      socket.write("HTTP/1.1 200 OK\n");
      var JSONContents = JSON.stringify(locations);
      socket.write("Content-Length:" + JSONContents.length);
      socket.write("\n\n"); // two carriage returns

      socket.write(JSONContents);
      console.log(JSONContents);
    } else if (r.substring(0, 3) == "GET") {
      console.log('OK');
      socket.write("HTTP/1.1 200 OK\n");
      fs.readFile('leaflet_test.html', 'utf8', function (err, contents) {
        socket.write("Content-Length:" + contents.length);
        socket.write("\n\n"); // two carriage returns

        socket.write(contents);
      });
    } else if (r.substring(0, 4) == "POST") {
      console.log('recieved POST');
      locations = parsePOSTRequest(r); // parses body of the request to get the current and destination locations

      console.log(locations);
      socket.write('HTTP/1.1 200 OK\n');
      socket.write("Content-Length:" + 0);
      socket.write("\n\n");
    }
  });
  socket.on('close', function () {
    console.log('Connection closed');
  });
  socket.on('end', function () {
    console.log('client disconnected');
  });
  socket.on('error', function () {
    console.log('client disconnected');
  });
});
server.listen(8080, function () {
  console.log('server is listening on port 8080');
});