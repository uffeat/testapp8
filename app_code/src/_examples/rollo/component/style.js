/* Purpose: Demonstrate and test style. */
await (async () => {
  const { component } = await import(
    "@/rollo/type/types/component/component"
  );
  const { element } = await import("@/rollo/tools/element");

  const root = component.div({ parent: document.body });
  const heading = element.h1({ parent: root }, "Headline");
  
  heading.update({paddingTop: '16px'})
  root.update({ display: "flex", justifyContent: "center" });
})();