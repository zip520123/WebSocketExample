var net = require('net');
var readline = require('readline');
var client = new net.Socket();
//read line module
// client.setEncoding('hex');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', function (line) {
  if (!client.destroyed) {
    if (line.indexOf('0x') == 0){
      var subString = line.substring(2,line.length)
      var data = Buffer.from(subString,'hex')
      client.write(data)
    }else{
      client.write(line)
    }
    
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
  console.log('Data from server:' );
  console.log(data);
});

