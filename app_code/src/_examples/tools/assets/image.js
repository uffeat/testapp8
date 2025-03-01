/* Purpose: Demonstrate and test assets used for images */
await (async () => {
  const { component } = await import("@/rollo/type/types/component/component");
  const { element } = await import("@/rollo/tools/element");
  const { assets } = await import("@/tools/assets");

  const root = component.div({ parent: document.body });

  component.img({
    width: "100%",
    src: assets.url("images/bevel.jpg"),
    parent: root,
  });

  
})();