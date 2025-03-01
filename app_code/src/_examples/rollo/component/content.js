/* Purpose: Demonstrate and test content */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );
  const { assets } = await import("@/tools/assets");

  const root = component.div({ id: "root", parent: document.body });
  const button = component.button("btn", { parent: root }, "Click");

  button.html.insert(await assets.fetch("foo.html"));
  button.on.click = (event) => button.clear("h1");
})();
