/*
vercel/foo
*/

const actual = await (await fetch("/api/ding")).text();
const expected = "DING";
if (actual !== expected) {
  console.error("Expected:", expected, "\nActual:", actual);
} else {
  console.log("Success!");
}
