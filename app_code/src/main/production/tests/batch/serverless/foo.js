/*
batch/serverless/foo
*/

/* In-module error message to retain traceback */
const error = (actual, expected) => {
  console.error("Expected:", expected, "\nActual:", actual);
};

export const test = async (unit_test) => {
  const actual = await (await fetch("/api/foo")).text()
  const expected = 'FOO'
  if (actual !== expected) {
    error(actual, expected)
  } else if (unit_test) {
    console.log('Success!')
  }

}