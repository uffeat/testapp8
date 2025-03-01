/* Purpose: Demonstrate and test attribute. */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

  const root = component.div({
    parent: document.body,
    attribute_foo: "FOO",
    attribute_bar: "BAR",
    attribute_thing: true,
  });

  root.attribute.stuff = true;
  root.attribute.bar = false;
})();