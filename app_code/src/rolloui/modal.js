import { Modal } from "bootstrap";
import { create } from "@/rollo";

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
    `div.modal${fade ? ".fade" : ""}`,
    { parent: document.body, attr_tabindex: "-1" }
  );

  const modal_dialog = create(
    // Handle centered, scrollable and size
    `div.modal-dialog${scrollable ? ".modal-dialog-scrollable" : ""}${
      centered ? ".modal-dialog-centered" : ""
    }${size ? ".modal-" + size : ""}`,
    { parent: element }
  );

  const modal_content = create(`${tag}.modal-content`, {
    parent: modal_dialog,
  });



  /* Header */
  if (dismissible || title) {
    const header = create(
      `div.modal-header${style ? ".text-bg-" + style : ""}`,
      { parent: modal_content }
    );

    if (title) {
      if (typeof title === "string") {
        title = create(`h1.modal-title.fs-3.text`, {}, title);
      } else {
        title.classList.add("modal-title");
      }
      header.append(title);
    }
    if (dismissible) {
      const close_button = create(
        `button.btn-close${
          ["danger", "primary", "secondary", "success"].includes(style)
            ? ".btn-close-white"
            : ""
        }`,
        { parent: header }
      );
      close_button.attribute.dataBsDismiss = "modal";
    }
    modal_content.append(header);
  }

  const modal_body = create(`div.modal-body`, { parent: modal_content });
  /* Content */
  if (content) {
    if (typeof content === "string") {
      modal_body.append(create("p", {}, content));
    } else {
      modal_body.append(content);
    }
  }

  /* Footer */
  if (buttons.length > 0) {
    const footer = create(`div.modal-footer`, { parent: modal_content });
    /* Transform buttons */
    buttons.forEach((b) => {
      if (Array.isArray(b)) {
        let [text, value, style = ""] = b;
        if (style) {
          style = `.btn-${style}`;
        }
        const button = create(
          `button.btn${style}`,
          {
            onclick: (event) => {
              event.target.closest(".modal").close(value);
            },
          },
          text
        );
        footer.append(button);
      } else {
        footer.append(b);
      }
    });
  }

  element.append(...hooks)

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

  // Enable closing by bubbling close custom event
  element.addEventListener("close", (event) => {
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
EXAMPLES

// Hello World
await (async () => {
  const { modal } = await import("utils/modal");
  const result = await modal(
    { title: "Hello world!", content: "The modal function is awesome.", size: 'lg', style: 'primary' },
    ["OK", true, 'success'], ["Cancel", false, 'danger']
  );
  console.log("Modal result:", result);
})();

*/
