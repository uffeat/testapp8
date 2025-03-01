/* Purpose: Demonstrate and test future */
await (async () => {
  const { Future } = await import("@/rollo/tools/future");

  /* Test utils */
  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      console.error(`Expected:`, expected, `Actual:`, actual);
    }
  };

  /* Verify promise basics */
  (async () => {
    const future = Future();
    if (future.value instanceof Promise) {
      success();
    } else {
      console.error(`Expected instance of Promise. Got: ${future.value}`);
    }
  })();

  /* Verify resolve basics */
  (async () => {
    const expected = 1;
    const future = Future();

    setTimeout(() => {
      future.resolve(expected);
    }, 0);

    test(false, future.resolved);
    test(expected, await future.value);
  })();

  /* Verify stringification basics */
  (() => {
    const future = Future({ value: 42 });
    test(
      `{"callback":null,"owner":null,"name":null,"rejected":false,"resolved":true,"session":0,"value":42}`,
      String(future)
    );
  })();

  /* Verify callback basics */
  (async () => {
    let actual;
    const expected = 1;
    const future = Future();
    future.then((value, future) => (actual = value));
    /*
    Alternatively:
    future.callback = (value, future) => {
      ////console.log("Callback got value:", value, " Session:", future.session);////
      actual = value;
    };
    */
    setTimeout(() => {
      /* Same as: future.resolve(expected); */
      future.value = expected;
    }, 0);
    await future.value;
    test(expected, actual);
  })();

  /* Verify blocking (unsettled) promise */
  (async () => {
    const future = Future();
    test(false, future.settled);
    await future.value;
    throw new Error(`Should never get to here!`);
  })();
})();
