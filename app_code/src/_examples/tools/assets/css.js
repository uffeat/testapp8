/* Purpose: Demonstrate and test assets used for css */
await (async () => {
  const { component } = await import("@/rollo/type/types/component/component");
  const { element } = await import("@/rollo/tools/element");
  const { Sheet } = await import("@/rollo/sheet/sheet");
  const { assets } = await import("@/tools/assets");

  component.div(
    { parent: document.body },
    element.h1({}, "Headline"),
    element.h2({}, "Headline")
  );

  Sheet(await assets.fetch("foo.css"), document);
 
})();