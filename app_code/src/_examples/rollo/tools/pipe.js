/* Primary purpose: Test and demo combined use of pipe. */
await (async () => {
  const { pipe } = await import("@/rollo/tools/pipe");

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

  const sum = (values) => pipe(0, ...values.map((v, i) => () => v + values[i]));
  test(6, sum([1, 2, 3]));

  const process_number = (number) =>
    pipe(
      number,
      function add_two(value) {
        return value + 2;
      },
      function multiply_by_three(value) {
        return value * 3;
      },
      function subtract_four(value) {
        return value - 4;
      }
    );
  test(17, process_number(5));

  const shout = (text) =>
    pipe(
      text,
      function strip(value) {
        return value.trim();
      },
      function upper(value) {
        return value.toUpperCase();
      },
      function exclaim(value) {
        return `${value}!`;
      }
    );
  test("HELLO WORLD!", shout("  hello world "));
})();