/* Purpose: Demonstrate and test handlers. */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

  const root = component.div(
    { parent: document.body },
    component.button(
      "btn",
      {
        on_click: (event) =>
          console.log(`Button with text '${event.target.text}' clicked`),
      },
      "Hello"
    ),
    component.button("btn.btn-primary", {}, "Click me!", function () {
      this.on.click = (event) =>
        console.log(`Button with text '${event.target.text}' clicked`);
    }),
    component.button("btn.btn-secondary", {}, "I only work once!", function () {
      this.on.click = (event) => {
        console.log(`Button with text '${this.text}' clicked`);
        this.handlers.clear();
        console.log(
          `Number of handlers on button with text '${this.text}':`,
          this.handlers.size()
        );
      };
      console.log(
        `Number of handlers on button with text '${this.text}':`,
        this.handlers.size()
      );
    })
  );
})();