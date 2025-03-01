/* Primary purpose: Test and demo range */
await (async () => {
  const { range } = await import("@/rollo/tools/range");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      error(expected, actual);
    }
  };

  (() => {
    const expected = JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const actual = JSON.stringify(range(1, 11));
    test(expected, actual);
  })();

  (() => {
    const expected = JSON.stringify([true, 4, 6, 8, 10, 12, 14, 16, 18, "END"]);
    const actual = JSON.stringify(
      range(1, 11, (i, start, end, range) => {
        if (i === start) {
          return true;
        } else if (i == end - 1) {
          range.push("END");
        } else {
          return 2 * i;
        }
      })
    );
    test(expected, actual);
  })();
})();
