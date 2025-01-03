import { Modal } from "bootstrap";
import { create } from "rollo/component";
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
    tag = "div",
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
      attribute_tabindex: "-1",
      ".fade": fade,
      hooks,
    },
    create(
      `div.modal-dialog${size ? ".modal-" + size : ""}`,
      {
        ".modal-dialog-scrollable": scrollable,
        ".modal-dialog-centered": centered,
      },
      create(
        `${tag}.modal-content`,
        {},
        !dismissible && !title
          ? undefined
          : create(
              `header.modal-header${style ? ".text-bg-" + style : ""}`,
              {},
              Text(`h1.modal-title.fs-3.text`, {}, title),
              dismissible
                ? CloseButton({ 
                  style, 
                  attribute_dataBsDismiss: "modal",
                 
                })
                : undefined
            ),
        create(`main.modal-body`, {}, Text(`p`, {}, content)),
        buttons.length === 0
          ? undefined
          : create(
              `footer.modal-footer`,
              {},
              buttons.map((button) => {
                if (button instanceof HTMLElement) {
                  return button;
                }
                return create({
                  tag: "button.btn",
                  _value: button.value,
                  on_click: function (event) {
                    /* Take into account that button may reside in a form */
                    event.preventDefault();
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
