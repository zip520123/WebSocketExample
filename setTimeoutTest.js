var sleepInterval = 1000
// var fun = require('./setTImeoutTest.js')
module.exports = {
    f: (array) => {
        console.log(array[0])

        if (array.length > 1) {
            setTimeout(() => {
                module.exports.f(array.slice(1))
            }, sleepInterval);
        }


    }

}