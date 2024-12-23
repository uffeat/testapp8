// data_text

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    thing: true,
    stuff: 42,
    name: "uffe",
  });

  /** Test json */
  console.log("Can be json:", data.jsonable);
  console.log("Raw json:", data.json());
  console.log("Sorted json:", data.json(true));
  /* Test toString for json-compatible data */
  console.log(`data: ${data}`);

  /** Test text */
  data.func = () => true;
  console.log("text:", data.text());
  /* Test toString for json-incompatible data */
  console.log(`data: ${data}`);
})();