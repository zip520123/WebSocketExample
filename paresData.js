var request = require('request');
const serverHost = 'http://220.130.165.91:8801/api'
module.exports = {
    parseData: function (data) {
        //console.log('parseData: ' + data.toString('hex'))
        if (data.length <= 2) {
            console.log("data lenght < 2")
            return
        }
        switch (data.readUInt16BE()) {
            case 0xaa24: //get info
                deviceInfo(data)
                break;
            case 0xaa22: //set Data
            case 0xaa25:
            case 0xaa90:
            case 0xaa91:
            case 0xaa92:
                setDataBackToServer(data)
                break;

            default:
                console.log('parse not in case')
                break;
        }
    }
}

function setDataBackToServer(data) {
    console.log("setDataBackToServer")
    // var jsonString = '{"FeederID":"138fbf4e-12e3-4591-b769-d635e4476348","HashID":"8657194522","Timestamp":"2018-09-18 11:21:48","FeedSetting":{"Data1":[1,5,3,30,3,0,0,50,6,0],"Data2":[0,0,0,0,0,0,0,0,0,0],"Data3":[0,0,0,0,0,0,0,0,0,0],"Data4":[0,0,0,0,0,0,0,0,0,0],"Data5":[0,0,0,0,0,0,0,0,0,0],"Data6":[0,0,0,0,0,0,0,0,0,0]},"Status":0,"Feed":0,"PreRotation":0,"Mode":0,"SchemaVer":"1.0"}'

    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    var json = {
        "FeederID": "138fbf4e-12e3-4591-b769-d635e4476348",
        "HashID": "8657194522",
        "Timestamp": date
    }
    if (data.readUInt16BE() === 0xaa22) {
        var number = data.readUInt8(2) >> 4
        var dataIndex = 'Data' + number
        var dataList = []
        for (var i = 0; i < 10; i += 1) {
            dataList.push(data.readUInt8(i + 3))
        }
        jsonDataObj.FeedSetting = {
            [dataIndex]: dataList
        }
    }
    if (data.readUInt16BE() === 0xaa25) {
        var number = data.readUInt8(2)
        var dataIndex = 'Data' + number
        var dataList = []
        for (var i = 0; i < 10; i += 1) {
            dataList.push(data.readUInt8(i + 3))
        }
        jsonDataObj.FeedSetting = {
            [dataIndex]: dataList
        }
    }


    postJSON(json)

}

function postJSON(json) {
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
        url: serverHost + '/deviceinfo',
        body: jsonDataObj,
        json: true
    }, function (error, response, body) {
        console.log(body);
    });
}