var fs = require('fs');
fs.appendFile("log.txt",'\n--------------------------------------------\n' ,(e)=>{ })
fs.appendFile("log.txt", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
