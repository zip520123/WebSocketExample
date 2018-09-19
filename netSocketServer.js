const net = require('net');
var parseData = require('./paresData.js')
var server = net.createServer();
var getInfoTimer;
var setDataTimer;
var sockets = [];
const getInfoInterval = 5000

getInfoTimer = setInterval(() => {
    sockets.forEach(socket => {
        if (socket.server !== true){
            getInfo(socket)
        }
    });
}, getInfoInterval);

server.on('close', function () {
    console.log('Server closed !');
});
server.on('connection', function (socket) {
    //this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
    //Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().
    // socket.setEncoding('hex');
    sockets.push(socket)
    console.log('Buffer size : ' + socket.bufferSize);

    console.log('---------server details -----------------');
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);

    var lport = socket.localPort;
    var laddr = socket.localAddress;
    console.log('Server is listening at LOCAL port' + lport);
    console.log('Server LOCAL ip :' + laddr);
    console.log('------------remote client info --------------');
    console.log('connection: ' + socket.remoteAddress + ', port:' + socket.remotePort);
 
    console.log('--------------------------------------------')
    server.getConnections(function (error, count) {
        console.log('Number of concurrent connections to the server : ' + count);
    });


    socket.setTimeout(800000, function () {
        // called after timeout -> same as socket.on('timeout')
        // it just tells that soket timed out => its ur job to end or destroy the socket.
        // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
        // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
        console.log('Socket timed out');
    });
    socket.on('data', (data) => {
        
        // console.log('Get Data from remote : ' + data);
        console.log('--------------------------------------------')
        
        try {
            console.log(data)

            var json = JSON.parse(data.toString('utf8'))
            if (json.server == true){
                console.log('get server json data: ' + JSON.stringify(json, null, 2))
                socket.server = true
                // console.log(JSON.stringify(obj, null, 2));
            }else{
                console.log('json parse success but not server: ' + JSON.stringify(json, null, 2))
                parseData.parseData(data)
            }
        } catch (error) {
            console.log('json parse error')
            parseData.parseData(data)
        }
        
        // console.log('start interval get info')
        // getInfoTimer = setInterval(() => {
        //     getInfo(socket)
        // }, getInfoInterval);
        // parseData.parseData(data)
        
        
    });
    socket.on('drain', function () {
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });
    socket.on('error', function (error) {
        console.log('Error : ' + error);
    });
    socket.on('timeout', function () {
        console.log('Socket timed out !');
        socket.end('Timed out!');
        // can call socket.destroy() here too.
    });
    socket.on('end', function (data) {
        console.log('socket end with data : ' + data);
        removeSocket(socket)
    });
    socket.on('close', function (error) {
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Socket closed!');
        // clearInterval(getInfoTimer)
        if (error) {
            console.log('Socket was closed coz of transmission error');
        }
    });

})
function removeSocket(socket) {
    sockets.splice(sockets.indexOf(socket), 1);
}
function getInfo(socket) {
    console.log('send getInfo command')
    const buf = Buffer.alloc(16);
    buf.writeUInt8(0xAA, 0)
    buf.writeUInt8(0x24, 1)
    buf.writeUInt8(0xAB, 15)
    socket.write(buf)
}
function deviceGet() {
    console.log('send deviceGet')
    const buf = Buffer.alloc(16);
    buf.writeUInt8(0xAA, 0)
    buf.writeUInt8(0x24, 1)
    buf.writeUInt8(0xAB, 15)
    sendDataToEachSocket(buf)
}

server.on('error', function (error) {
    console.log('Error: ' + error);
});
server.on('listening', function () {
    console.log('Server is listening!');
});
server.listen(8080)

//read line module
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', function (line) {
    sendDataToEachSocket(line)
})
function sendDataToEachSocket(line) {
    if (line.indexOf('0x') == 0){
        var subString = line.substring(2,line.length)
        var data = Buffer.from(subString,'hex')
        sockets.forEach(socket => {
            socket.write(data)
        });    
      }else{
        sockets.forEach(socket => {
            socket.write(line)
        });    
      }
    
}