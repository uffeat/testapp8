// type_classes

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: undefined,
  });

  const classes = data.__classes__;

  console.log("classes.classes:", classes.classes);
  console.log("classes.defined:", classes.defined);
  console.log("classes.names:", classes.names);
  console.log("classes.prototypes:", classes.prototypes);

  console.log("size:", classes.size);

  console.log("clean is defined:", classes.defined.has("clean"));
  console.log("foo is defined:", classes.defined.has("foo"));

  classes.prototypes.clean.clean.call(data);
  console.log("After clean:", data.data);
})();