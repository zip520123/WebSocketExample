const sleepInterval = 2000
function sendDataToEachSocket(data){
  console.log(data)
}
var f = (array) => {
  sendDataToEachSocket(array[0])
  if (array.length > 1){
      setTimeout(()=>{
        f(array.slice(1))
      },sleepInterval)
  }
}
f([1,2,3,4,5])