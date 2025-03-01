/* Purpose: Demonstrate and test data. */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

  const root = component.div({
    parent: document.body,
    data_foo: "FOO",
    data_bar: "BAR",
    data_thing: true,
  });

  root.data.stuff = true;
  root.data.bar = false;
})();