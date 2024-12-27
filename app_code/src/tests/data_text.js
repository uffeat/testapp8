// data_text

/* Purpose: Demonstate and test text related features */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: true,
  });

  /* Test jsonable */
  (() => {
    console.log(`Testing 'jsonable'...`);
    const expected = true;
    const actual = data.jsonable;
    const message = `Expected: ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();

  /* Test unsorted json */
  (() => {
    console.log(`Testing unsorted json...`);
    const json = data.json();
    const parsed = JSON.parse(json);
    if (data.match(parsed)) {
      console.log(`Success!`);
    } else {
      console.error(`Something went wrong...:`, json);
    }
  })();

  /* Test sorted json */
  (() => {
    console.log(`Testing sorted json...`);
    const expected = '{"bar":"bar","foo":"foo","stuff":42,"thing":true}';
    const actual = data.json(true);
    const message = `Expected: ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();

  /* Test unsorted text */
  (() => {
    console.log(`Testing unsorted text...`);
    const text = data.text();
    const parsed = JSON.parse(text);
    if (data.match(parsed)) {
      console.log(`Success!`);
    } else {
      console.error(`Something went wrong...:`, text);
    }
  })();

  /* Test sorted text */
  (() => {
    console.log(`Testing sorted text...`);
    const expected = '{"bar":"bar","foo":"foo","stuff":42,"thing":true}';
    const actual = data.text(true);
    const message = `Expected: ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();

  /* Test toString for json-compatible data */
  (() => {
    console.log(`Testing toString for json-compatible data...`);
    const text = String(data);
    const parsed = JSON.parse(text);
    if (data.match(parsed)) {
      console.log(`Success!`);
    } else {
      console.error(`Something went wrong...:`, text);
    }
  })();

  /* Test toString for json-incompatible data */
  (() => {
    data.func = () => true;
    data.things = [1, 2, 3, class Stuff {}];
    console.log(`Testing toString for json-incompatible data...`);
    console.log(`As string: ${data}`);
  })();
})();
