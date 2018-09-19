var net = require('net');
var readline = require('readline');
var client = new net.Socket();
//read line module
client.setEncoding('hex');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', function (line) {
  if (!client.destroyed) {
    client.write(line)
  }else{
    console.log('client destoryed')
  }
})
// client


client.connect(8080, '127.0.0.1', function () {
  console.log('Connected');
  client.write('Hello, server! Love, Client.');
})
client.on('connect', function () {
  console.log('Client: connection established with server');

  console.log('---------client details -----------------');
  var address = client.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Client is listening at port' + port);
  console.log('Client ip :' + ipaddr);
  console.log('Client is IP4/IP6 : ' + family);

  client.write('hello from client');

});

client.on('error', function (error) {
  console.log('Error: ' + error);
});
client.on('close',(error) => {
  console.log('close: ' + error);
})
client.on('data', function (data) {
  console.log('Data from server:' + data);
});



//   setTimeout(function(){
//     client.end('Bye bye server');
//   },5000);