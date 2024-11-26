import { Offcanvas } from "bootstrap";
import { create } from "rollo/component";
import { use_hooks } from "rollo/hooks/use_hooks";
import { CloseButton } from "rolloui/CloseButton";
import { Text } from "rolloui/Text";

const ID = "modal";
const PARENT = document.body;

/* Shows an offcanvas and returns a promise that resolves to the offcanvas' value, 
when the offcanvas hides */
export function offcanvas(
  {
    content,
    dismissible = true,
    hooks,
    placement = "bottom",
    scroll = false,
    style,
    title = null,
  },
  ...buttons
) {
  if (!["bottom", "end", "start", "top"].includes(placement)) {
    throw new Error(`Invalid placement: ${placement}`);
  }
  const element = create(
    `div.offcanvas.d-flex.flex-column`,
    {
      id: ID,
      parent: PARENT,
      attr_tabindex: "-1",
      [`css_offcanvas-${placement}`]: true,
    },
    !dismissible && !title
      ? undefined
      : create(
          `DIV.offcanvas-header${style ? ".text-bg-" + style : ""}`,
          {},
          Text(`H1.fs-2.text`, {}, title),
          dismissible
            ? CloseButton({ style, attr_dataBsDismiss: "offcanvas" })
            : undefined
        ),

    create(`MAIN.offcanvas-body.flex-grow-1`, {}, Text(`P`, {}, content)),
    buttons.length === 0
      ? undefined
      : create(
          `FOOTER.d-flex.justify-content-end.column-gap-3.p-3.m-0`,
          {},
          buttons.map((button) =>
            button instanceof HTMLElement
              ? button
              : create({
                  tag: "button.btn",
                  _value: button.value,
                  on_click: function (event) {
                    const element = document.getElementById(ID);
                    element._value = this._value;
                    element.$.close = true;
                  },
                  ...button,
                })
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
  // Handle scroll
  config.scroll = scroll;

  // Create Bootstrap Offcanvas
  const offcanvas = new Offcanvas(element, config);

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

  /* Add effect to close offcanvas */
  element.effects.add(
    (data) => {
      offcanvas.hide();
    },
    { close: true }
  );

  /* Give offcanvas element a 'close' method that can set value 
  (on offcanvas element) and close the offcanvas */
  element.close = (value) => {
    element.value = value;
    offcanvas.hide();
  };

  // Show the offcanvas
  offcanvas.show();

  /* Return a promise that resolves to the offcanvas element's value, 
  when the offcanvas hides */
  return new Promise((resolve, reject) => {
    element.addEventListener("hide.bs.offcanvas", (event) => {
      resolve(element._value);
    });
  });
}

/* Helper function for closing offcanvas with a given value. 
Use when conditional closing and/or flexibility re modal value is needed. */
export function close(value) {
  const element = document.getElementById(ID);
  element._value = value;
  element.$.close = true;
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
