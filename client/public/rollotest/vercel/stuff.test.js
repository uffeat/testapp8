/*
vercel/stuff
*/

await (async () => {
  const actual = await (await fetch("/api/stuff")).text();
  const expected = "STUFF";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else {
    console.log("Success!");
  }
})();

await (async () => {
  const actual = await (await fetch("/api/stuff/thing")).text();
  const expected = "THING";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else {
    console.log("Success!");
  }
})();
