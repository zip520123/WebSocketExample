var request = require('request');
module.exports = {
    parseData : function (data) {
    console.log('parseData: ' + data.toString('hex'))
    if (data.length <= 2){
        console.log("data lenght < 2")
        return
    }
    switch (data.readUInt16BE()) {
        case 0xaa24:
            deviceInfo(data)
            break;
        
        default:
            console.log('parse not in case')
            break;
    }
}
}
function deviceInfo(data) {
    //aa241100100e7a
    // const buf = Buffer.alloc(16);
    // buf.write('aa241100100e7a',0,'hex')
    // buf.writeUInt8(0xAB,15)
    var battery = data.readUInt8(2)
    var status = data.readUInt8(3)
    var hour = data.readUInt8(4)
    var min = data.readUInt8(5)
    var voltage = data.readUInt8(6)
    var total_WI_1 = data.readUInt8(7)
    var total_WI_2 = data.readUInt8(8)
    var total_WI_3 = data.readUInt8(9)
    var day_WI_1 = data.readUInt8(10)
    var day_WI_2 = data.readUInt8(11)
    var day_WI_3 = data.readUInt8(12)
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') 
    var jsonDataObj = {
        "FeederID": "138fbf4e-12e3-4591-b769-d635e4476348",
        "Timestamp": date,
        "Status": status,
        "Hour": hour,
        "Min": min,
        "Battery": battery,
        "Solar": 1,
        "Voltage": voltage,
        "TotalWeight": 250,
        "DayWeight": 200
    }
    console.log(jsonDataObj)
    request.post({
        headers: {
            'content-type': 'application/json'
        },
        url: 'http://220.130.165.91:8801/api/deviceinfo',
        body: jsonDataObj,
        json: true
    }, function (error, response, body) {
        console.log(body);
    });
}
