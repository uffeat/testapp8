/* Purpose: Demonstrate and test send. */
await (async () => {
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

  const root = component.div({ parent: document.body });
  const heading = component.h1({ parent: root }, "Headline");
  const button = component.button(
    "btn.btn-primary",
    { parent: root },
    "Change!"
  );
  const icon = component.img({ parent: button, src: HeartIcon });
  const span = component.span({ parent: button, text: "Some text..." });

  button.on.click = (event) =>
    button.send("x_change", {
      bubbles: true,
      detail: "Changed text",
      trickle: true,
    });

  root.on.x_change = (event) => (heading.text = event.detail);
  span.on.x_change = (event) => (span.text = event.detail);
})();