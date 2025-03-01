/* Purpose: Demonstrate and test classes */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

  const root = component.div({ id: "root", parent: document.body });
  const button = component.button(
    "btn.m-3",
    { parent: root },
    "Hello",
    function () {
      this.classes.add("d-flex");
    }
  );

  button.classes.add("btn-primary");
})();
