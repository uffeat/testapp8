
/* Purpose: Demonstrate and test connected. */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

  const root = component.div(
    { parent: document.body },
    component.button(
      "btn.btn-primary",
      { },
      "Hello",
      function () {
        this.connected.effects.add((change) => {
          if (change.data.current) {
            change.owner.owner.text = "HELLO WORLD";
          }
        }, true);
      }
    )
  );
})();