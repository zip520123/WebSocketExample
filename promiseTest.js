let letters = ["a", "b", "c"];

function doSomething(arr) {
  console.log(arr[0]);
  if (arr.length > 1) {
    setTimeout(() => doSomething(arr.slice(1)), 1000);
  }
}

doSomething(letters);