var request = require('request');
const serverHost = 'http://220.130.165.91:8801/api'
function setDataBackToServer(data) {
    var jsonString = '{"FeederID":"138fbf4e-12e3-4591-b769-d635e4476348","HashID":"8657194522","Timestamp":"2018-09-18 11:21:48","FeedSetting":{"Data1":[1,5,3,30,3,0,0,50,6,0],"Data2":[0,0,0,0,0,0,0,0,0,0],"Data3":[0,0,0,0,0,0,0,0,0,0],"Data4":[0,0,0,0,0,0,0,0,0,0],"Data5":[0,0,0,0,0,0,0,0,0,0],"Data6":[0,0,0,0,0,0,0,0,0,0]},"Status":0,"Feed":0,"PreRotation":0,"Mode":0,"SchemaVer":"1.0"}'

    var json = JSON.parse(jsonString)
    var number = data.readUInt8(2)

    Object.keys(json.FeedSetting).map((dataIndex, index) => {
        if ((number >> 4) - 1 === index) {
            for (var i = 0; i<10 ; i += 1){
                json.FeedSetting[dataIndex][i] = data.readUInt8(i + 3)
            }
        }
    })

    console.log(json)
    request.post({
        headers: {
            'content-type': 'application/json'
        },
        url: serverHost + '/deviceget',
        body: json,
        json: true
    }, function (error, response, body) {
        console.log(body);
    });
}
const buf = Buffer.alloc(16);
buf.writeUInt8(0x20,2)
buf.write('0102030405060708090a',3,'hex')
console.log(buf)
setDataBackToServer(buf)