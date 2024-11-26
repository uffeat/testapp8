import { Modal } from "bootstrap";
import { create } from "rollo/component";
import { use_hooks } from "rollo/hooks/use_hooks";
import { CloseButton } from "rolloui/CloseButton";
import { Text } from "rolloui/Text";

const ID = "modal";
const PARENT = document.body;

/* Shows a modal and returns a promise that resolves to the modal's value, 
when the modal hides. */
export function modal(
  {
    content,
    centered,
    dismissible = true,
    fade = true,
    hooks,
    scrollable,
    size,
    style,
    tag = "DIV",
    title,
  },
  ...buttons
) {
  // Create modal element
  const element = create(
    `div.modal`,
    {
      id: ID,
      parent: PARENT,
      attr_tabindex: "-1",
      css_fade: fade,
    },
    create(
      `DIV.modal-dialog${size ? ".modal-" + size : ""}`,
      {
        "css_modal-dialog-scrollable": scrollable,
        "css_modal-dialog-centered": centered,
      },
      create(
        `${tag}.modal-content`,
        {
          parent: create(`div.modal-dialog${size ? ".modal-" + size : ""}`, {
            "css_modal-dialog-scrollable": scrollable,
            "css_modal-dialog-centered": centered,
          }),
        },
        !dismissible && !title
          ? undefined
          : create(
              `HEADER.modal-header${style ? ".text-bg-" + style : ""}`,
              {},
              Text(`H1.modal-title.fs-3.text`, {}, title),
              dismissible
                ? CloseButton({ style, attr_dataBsDismiss: "modal" })
                : undefined
            ),
        create(`MAIN.modal-body`, {}, Text(`P`, {}, content)),
        buttons.length === 0
          ? undefined
          : create(
              `FOOTER.modal-footer`,
              {},
              buttons.map((button) => {
                if (button instanceof HTMLElement) {
                  return button;
                }
                return create({
                  tag: "button.btn",
                  _value: button.value,
                  on_click: function (event) {
                    const element = document.getElementById(ID);
                    element._value = this._value;
                    element.$.close = true;
                  },
                  ...button,
                });
              })
            )
      )
    ),
    use_hooks(hooks)
  );

  // Handle dismissible
  const config = {};
  if (!dismissible) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  // Create Bootstrap Modal
  const modal = new Modal(element, config);

  // Enable closing by bubbling 'close' custom event
  const onclose = (event) => {
    event.stopPropagation();
    element._value = event.detail;
    element.$.close = true;
  };
  element.addEventListener("close", onclose);

  // Clean up
  element.addEventListener("hidden.bs.modal", () => {
    modal.dispose();
    element.remove();
    element.reactive.reset();
    element.removeEventListener("close", onclose);
    delete element._value;
  });

  /* Add effect to close modal */
  element.effects.add(
    (data) => {
      modal.hide();
    },
    { close: true }
  );

  // Show the modal
  modal.show();

  /* Return a promise that resolves to the modal element's _value, 
  when the modal hides */
  return new Promise((resolve, reject) => {
    element.addEventListener("hide.bs.modal", (event) => {
      resolve(element._value);
    });
  });
}

/* Helper function for closing modal with a given value. 
Use when conditional closing and/or flexibility re modal value is needed. */
export function close(value) {
  const element = document.getElementById(ID);
  element._value = value;
  element.$.close = true;
}

/*
EXAMPLE

const result = await modal(
  {
    title: "Hello world!",
    content: "The modal function is awesome.",
    size: "lg",
    style: "primary",
  },
  ["OK", true, "success"],
  ["Cancel", false, "danger"]
);
console.log("Modal result:", result);

*/
