import { Modal } from "bootstrap";
import { create } from "rollo/component";
import { Button } from "rolloui/Button";
import { CloseButton } from "rolloui/CloseButton";


const ID = "modal";
const PARENT = document.body;


function onclick(event) {
  const element = this.closest(".modal");
  element._value = this.value;
  element.$.close = true;
}

let imported_buttons = []


function ModalComponent() {
  
}






/* Shows a modal and returns a promise that resolves to the modal's value, 
when the modal hides. */
export function modal(
  {
    content,
    centered,
    dismissible = true,
    fade = true,
    hooks = [],
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
    // Handle fade animation
    `div.modal`,
    {
      id: ID,
      parent: PARENT,
      attr_tabindex: "-1",
      ".fade": fade,
      _value: undefined,
    },
    create(
      `div.modal-dialog${size ? ".modal-" + size : ""}`,
      {
        ".modal-dialog-scrollable": scrollable,
        ".modal-dialog-centered": centered,
      },
      create(
        `${tag}.modal-content`,
        {
          parent: create(
            `div.modal-dialog${size ? ".modal-" + size : ""}`,
            {
              ".modal-dialog-scrollable": scrollable,
              ".modal-dialog-centered": centered,
            }
          ),
        },
        !dismissible && !title
          ? undefined
          : create(
              `div.modal-header${style ? ".text-bg-" + style : ""}`,
              {},
              typeof title === "string"
                ? create(`h1.modal-title.fs-3.text`, {}, title)
                : title,
              dismissible
                ? CloseButton({ style, attr_dataBsDismiss: "modal" })
                : undefined
            ),
        create(
          `div.modal-body`,
          {},
          typeof content === "string" ? create("p", {}, content) : content
        ),
        buttons.length === 0
          ? undefined
          : create(
              `div.modal-footer`,
              {},
              buttons.map((b) => {
                if (Array.isArray(b)) {
                  const [text, value, style] = b;
                  return Button({
                    text,
                    value,
                    style,
                    on_click: onclick,
                  });
                } else {
                  imported_buttons.push(b)
                }

                b.addEventListener('click', onclick)
                return b;
              })
            )
      )
    ),
    ...hooks
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
    imported_buttons.forEach((button) => button.removeEventListener('click', button))
    imported_buttons = []
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
