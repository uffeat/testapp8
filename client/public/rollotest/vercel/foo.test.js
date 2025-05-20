/*
vercel/foo
*/

const actual = await (await fetch("/api/foo")).text();
const expected = "FOO";
if (actual !== expected) {
  console.error("Expected:", expected, "\nActual:", actual);
} else {
  console.log("Success!");
}
