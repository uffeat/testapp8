await (async () => {
  

  console.warn('No test')////

  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      console.error(`Expected:`, expected, `Actual:`, actual);
    }
  };


})();
