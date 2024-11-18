import "@/bootstrap.scss";

import { Modal } from "bootstrap";
import { create_element } from "utils/create_element";

/* Shows a modal and returns a promise that resolves to the modal's value, 
when the modal hides. */
export function modal(
  {
    content = "",
    centered,
    dismissible = true,
    effects = [],
    fade = true,
    scrollable,
    size,
    style,
    tag = "div",
    title = "",
  },
  ...buttons
) {
  // Create modal element
  const element = create_element(
    // Handle fade animation
    `div.modal${fade ? ".fade" : ""}`,
    { parent: document.body },
    create_element(
      // Handle centered and scrollable
      `div.modal-dialog${scrollable ? ".modal-dialog-scrollable" : ""}${
        centered ? ".modal-dialog-centered" : ""
      }`,
      {},
      function set_size() {
        if (size) {
          if (!["sm", "lg", "xl", "fullscreen"].includes(size)) {
            throw new Error(`Invalid size: ${size}`);
          }
          this.classList.add(`modal-${size}`);
        }
      },
      create_element(
        `${tag}.modal-content`,
        {},
        create_element(
          `div.modal-header`,
          {},
          function set_style() {
            if (style) {
              this.classList.add(`text-bg-${style}`);
            }
          },
          function add_title() {
            if (title) {
              if (typeof title === "string") {
                title = create_element(`h1.modal-title.fs-3.text`, {}, title);
              } else {
                if (!(title instanceof HTMLElement)) {
                  throw new Error(`Expected html element. Got:`, title);
                }
                title.classList.add("modal-title");
              }
              return title;
            }
          },
          function add_dismiss_button() {
            if (dismissible) {
              return create_element(
                `button.btn-close`,
                {},
                function set_style() {
                  if (style) {
                    if (
                      ["danger", "primary", "secondary", "success"].includes(
                        style
                      )
                    ) {
                      this.classList.add(`btn-close-white`);
                    }
                  }
                }
              ).update_dataset({
                bsDismiss: "modal",
              });
            }
          }
        ),
        // Handle body
        create_element(`div.modal-body`, {}, function add_content() {
          if (content) {
            /* Handle content as multiple elements (or strings) wrapped in an array.
            Useful for avoiding redundant wrapper divs */
            if (Array.isArray(content)) {
              content.forEach((element) => {
                if (typeof element === "string") {
                  /* Convert string to element */
                  this.append(create_element("p", {}, element));
                } else {
                  if (!(element instanceof HTMLElement)) {
                    throw new Error(
                      `Expected html element or text. Got:`,
                      element
                    );
                  }
                  this.append(element);
                }
              });
              return;
            }
            /* Handle monolithic content */
            if (typeof content === "string") {
              /* Convert string to element */
              content = create_element("p", {}, content);
            } else {
              if (!(content instanceof HTMLElement)) {
                throw new Error(`Expected html element. Got:`, content);
              }
            }
            return content;
          }
        }),
        function add_footer() {
          if (buttons.length > 0) {
            return create_element(
              `div.modal-footer`,
              {},
              /* Transform buttons */
              ...buttons.map((b) => {
                if (Array.isArray(b)) {
                  let [text, value, style = ""] = b;
                  if (style) {
                    style = `.btn-${style}`;
                  }
                  return create_element(
                    `button.btn${style}`,
                    {
                      onclick: (event) => {
                        event.target.closest(".modal").close(value);
                      },
                    },
                    text
                  );
                } else {
                  if (!(b instanceof HTMLElement)) {
                    throw new Error(`Expected html element. Got:`, b);
                  }
                  return b;
                }
              })
            );
          }
        }
      )
    ),
    /* NOTE effect functions are added as child functions and therefore bound 
    to modal element. */
    ...effects
  ).update_attrs({ tabindex: "-1" });

  // Handle dismissible
  const config = {};
  if (!dismissible) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  // Create Bootstrap Modal
  const modal = new Modal(element, config);

  // Ensure clean-up
  element.addEventListener("hidden.bs.modal", () => {
    modal.dispose();
    element.remove();
  });

  /* Give modal element a 'close' method that can set value 
  (on modal element) and close the modal */
  element.close = (value) => {
    element.value = value;
    modal.hide();
  };

  // Show the modal
  modal.show();

  // Enable closing by bubbling x-close custom event
  element.addEventListener("x-close", (event) => {
    event.stopPropagation();
    element.close(event.detail);
  });

  /* Return a promise that resolves to the modal element's value, 
  when the modal hides */
  return new Promise((resolve, reject) => {
    element.addEventListener("hide.bs.modal", (event) => {
      resolve(element.value);
    });
  });
}

/* Helper function for closing modal with a given value. 
Typically, called from within a button's click handler.
Use when conditional closing and/or flexibility re modal value is needed. */
export function close(value) {
  document.querySelector(".modal").close(value);
}

/*
# EXAMPLES

## Example: Hello World

await (async () => {
  const { modal } = await import("utils/modal");
  modal({ title: "Hello world!", content: "The modal function is awesome." });
})();


## Example: Custom buttons

await (async () => {
  const { modal } = await import("utils/modal");
  const { create_element } = await import("utils/create_element");
  const value = await modal(
    {
      title: create_element('h2', {}, 'Modal with buttons'),
      content: "This is the body!",
      dismissible: false,
    },
    ["OK", true, "primary"],
    ["Cancel", false, "secondary"]
  );
  console.log("value:", value);
})();




*/
