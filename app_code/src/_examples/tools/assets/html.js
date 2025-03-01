/* Purpose: Demonstrate and test assets used for html */
await (async () => {
  const { component } = await import("@/rollo/type/types/component/component");
  const { assets } = await import("@/tools/assets");

  const root = component.div({ parent: document.body });

  root.html.insert(await assets.fetch("foo.html"));
 
})();