/* Purpose: Demonstrate and test assets used for js */
await (async () => {
  const { component } = await import("@/rollo/type/types/component/component");
  const { assets } = await import("@/tools/assets");

  const root = component.div({ parent: document.body });

  root.html.insert((await assets.import("foo.js")).foo);
 
})();