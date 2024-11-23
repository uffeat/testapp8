import { Toast } from "bootstrap";
import { create } from "rollo/component";
import { CloseButton } from "rolloui/CloseButton";
import { Text } from "rolloui/Text";

/* Prepare container suitable for stacking toasts */
document.body.classList.add("position-relative");
const toast_container = create(
  `div.position-fixed.bottom-0.end-0.p-3.d-flex.flex-column.row-gap-3.z-3`,
  { parent: document.body }
);

export function toast(
  title,
  content,
  {
    animation = true,
    autohide = true,
    delay = 3000,
    dismissible = true,
    style = "primary",
  } = {}
) {
  // Create toast element
  const element = create(
    `div.toast`,
    {
      parent: toast_container,
      role: "alert",
      attr_ariaLive: "assertive",
      attr_ariaAtomic: "true",
    },
    create(
      `div.toast-header.d-flex.align-items-center${
        style ? ".text-bg-" + style : ""
      }`,
      {},
      Text(`h1.fs-6`, { "css_my-0": true }, title),
      dismissible
        ? CloseButton({
            style,
            attr_dataBsDismiss: "toast",
            "css_ms-auto": true,
          })
        : undefined
    ),
    create(`div.toast-body`, {}, Text(`p`, {}, content))
  );

  const toast = new Toast(element, { animation, autohide, delay });
  // Ensure clean-up
  element.addEventListener("hidden.bs.toast", () => {
    toast.dispose();
    element.remove();
  });
  // Show the toast
  toast.show();
}

/*
EXAMPLE

toast("Staying long", "Content", { delay: 20000, style: 'success' });
*/
