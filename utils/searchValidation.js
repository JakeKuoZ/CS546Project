function checkEmpty(str) {
    if (!str) {
      throw "Please provide key words for service";
    }
  
    if (str === undefined || str === null) {
      throw "Input is not valid";
    }
  }
  
  function checkString(str) {
    if (typeof str !== "string") {
      throw "Input is not string";
    }
  }
  
  function checkArray(array) {
    if (!Array.isArray(array)) {
      throw "Not valid array";
    }
  }
  
  module.exports = {
    checkEmpty,
    checkString,
    checkArray,
  };
  