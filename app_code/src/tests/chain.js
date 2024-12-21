// chain

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");
  /* Create test object */
  const data = type.create("data", {
    foo: "FOO",
    nothing: undefined,
  });
  /* Test that members can be retrieved from __chain__ */
  console.log("data before clean:", data);
  data.__chain__.prototypes.data.clean.call(data);
  if ('nothing' in data) {
    throw new Error(`'nothing' was NOT deleted.`)
  } else {
    console.log(`'nothing' was deleted.`);
  }
  /* Test that the 'in' operator used on prototypes can be used to 
  discriminate between defined and add-hoc-added propeties */
  if ("size" in data.__chain__.prototypes) {
    console.log(`'size' in chain`);
  } else {
    throw new Error(`'size' was incorrectly NOT found in chain.`)
  }
  if ("size" in data) {
    console.log(`'size' in object`);
  } else {
    throw new Error(`'size' was incorrectly NOT found in object.`)
  }
  if ("foo" in data.__chain__.prototypes) {
    throw new Error(`'foo' was incorrectly found in chain.`)
  } else {
    console.log(`'foo' NOT in chain`);
  }
  if ("foo" in data) {
    console.log(`'foo' in object`);
  } else {
    throw new Error(`'foo' was incorrectly NOT found in object.`)
  }
  /* Test 'names' */
  console.log('names:', data.__chain__.names);
})();