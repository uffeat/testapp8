import { Offcanvas } from "bootstrap";
import { create } from "rollo/component";
import { Button } from "rolloui/Button";

/* Shows an offcanvas and returns a promise that resolves to the offcanvas' value, 
when the offcanvas hides */
export function offcanvas(
  {
    bodyScroll = false,
    content = null,
    dismissible = true,
    placement = "bottom",
    title = null,
  },
  ...buttons
) {
  // Create offcanvas element
  const element = create(
    
    `div.offcanvas.d-flex.flex-column`,
    {
      parent: document.body,
      attr_tabindex: "-1",
      /* Handle placement */
      [`.offcanvas-${placement}`]: function () {
        {
          if (!["bottom", "end", "start", "top"].includes(placement)) {
            throw new Error(`Invalid placement: ${placement}`);
          }
          return true;
        }
      },
    },
    create(
      `header.offcanvas-header`,
      {},
      // Handle title
      typeof title === "string" ? create("h1.fs-2.text", {}, title) : title,
      /* Add close button, if dismissible */
      dismissible
        ? create(`button.btn-close`, {
            type: "button",
            attr_dataBsDismiss: "offcanvas",
            attr_ariaLabel: "Close",
          })
        : undefined
    ),
    create(
      `main.offcanvas-body.flex-grow-1`,
      {},
      /* Handle content */
      typeof content === "string" ? create("p", {}, content) : content
    ),
    /* Handle footer/buttons */
    buttons.length === 0
      ? undefined
      : create(
          "footer.d-flex.justify-content-end.column-gap-3.p-3.m-0",
          {},
          buttons.map((b) => {
            if (Array.isArray(b)) {
              const [text, value, style] = b;
              return Button({
                text,
                value,
                style,
                on_click: (event) =>
                  event.target.closest(".offcanvas").close(value),
              });
            }
            return b;
          })
        )
  );

  // Handle dismissible
  const config = {};
  if (!dismissible) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  // Handle scroll
  config.scroll = bodyScroll;

  // Create Bootstrap Offcanvas
  const offcanvas = new Offcanvas(element, config);

  // Ensure clean-up
  element.addEventListener("hidden.bs.offcanvas", () => {
    offcanvas.dispose();
    element.remove();
  });

  /* Give offcanvas element a 'close' method that can set value 
  (on offcanvas element) and close the offcanvas */
  element.close = (value) => {
    element.value = value;
    offcanvas.hide();
  };

  // Show the offcanvas
  offcanvas.show();

  // Enable closing by bubbling close custom event
  element.addEventListener("close", (event) => {
    event.stopPropagation();
    element.close(event.detail);
  });

  /* Return a promise that resolves to the offcanvas element's value, 
  when the offcanvas hides */
  return new Promise((resolve, reject) => {
    element.addEventListener("hide.bs.offcanvas", (event) => {
      resolve(element.value);
    });
  });
}

/* Helper function for closing offcanvas with a given value. */
export function close(value) {
  const element = document.getElementById(ID);
  element.close(value);
}

/*
# EXAMPLES

const result = await offcanvas(
  {
    title: "Hello world!",
    content: "The offcanvas function is awesome.",
  },
  ["OK", true, "success"],
  ["Cancel", false, "danger"]
);
console.log("Modal result:", result);

*/
