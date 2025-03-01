/* Purpose: Demonstrate and test sheets */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );
  const { assets } = await import("@/tools/assets");
  const { Sheet } = await import("@/rollo/sheet/sheet");

  component.div(
    { parent: document.body },
    component.h1({}, "Hello", Sheet(await assets.fetch("foo.css")))
  );
})();