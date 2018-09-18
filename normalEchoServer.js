const net = require('net')

net.createServer(socket => {
  socket.on('data', function (data) {
    console.log('Echoing: %s', data.toString())
    socket.write(data);
    //    socket.write(data.toString());


  })
  socket.on('connect' , function () {
    console.log('connection: ' +  socket.remoteAddress + ', port:' + socket.remotePort);
    // setInterval(() => {
    //   getInfo(socket);
    // }, 5000);
  })
  
}).listen(8080)
function getInfo(socket) {

  
}
function sendPost(data) {
  var request = require('request');
  request.post({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    url: 'http://localhost/test2.php',
    body: "mes=heydude"
  }, function (error, response, body) {
    console.log(body);
  });
}