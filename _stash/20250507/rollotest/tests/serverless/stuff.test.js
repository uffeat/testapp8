/*
serverless/stuff
*/

/* In-module error message to retain traceback */
const error = (actual, expected) => {
  console.error("Expected:", expected, "\nActual:", actual);
};

export const test = async (unit_test) => {
  const actual = await (await fetch("/api/stuff")).text()
  const expected = "STUFF";
  if (actual !== expected) {
    error(actual, expected);
  } else if (unit_test) {
    console.log("Success!");
  }
};

export const test_thing = async (unit_test) => {
  const actual = await (await fetch("/api/stuff/thing")).text()
  const expected = "THING";
  if (actual !== expected) {
    error(actual, expected);
  } else if (unit_test) {
    console.log("Success!");
  }
};