var request = require('request');
var jsonDataObj = {"FeederID":"10 0 2","Timestamp":"2018-06-04 17:40:16","Status":0,"Hour":17,"Min":38,"Battery":0,"Solar":1,"Voltage":122,"TotalWeight":250,"DayWeight":200}
request.post({
  headers: {'content-type' : 'application/json'},
  url:     'http://220.130.165.91:8801/api/deviceget',
  body:    jsonDataObj,
  json: true
}, function(error, response, body){
  console.log(body);
});