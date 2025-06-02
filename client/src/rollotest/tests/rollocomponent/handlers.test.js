import { component } from "@/rollocomponent/component.js";

const menu = component.menu(
  "flex.gap-x-3",
  { parent: document.body },
  component
    .button(
      "btn.btn-primary",
      {
        parent: document.body,
      },
      "Button"
    )
    .handlers.add({
      click$run: (event) => console.log("Clicked!"),
    }),
  component
    .button(
      "btn.btn-primary",
      {
        parent: document.body,
      },
      "Button"
    )
    .handlers.add({
      click$run: (event) => console.log("Clicked!"),
    })
);

component
  .button(
    "btn.btn-primary",
    {
      parent: document.body,
    },
    "Button"
  )
  .handlers.add({
    click$once: (event) => console.log("Clicked!"),
  });

component.button(
  "btn.btn-primary",
  {
    parent: document.body,
    "@click": (event) => console.log("Clicked!"),
  },
  "Button"
);

component.button(
  "btn.btn-primary",
  {
    parent: document.body,
  },
  "Button"
).on.click$once = (event) => console.log("Clicked!");
