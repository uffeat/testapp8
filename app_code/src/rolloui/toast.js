import { Toast } from "bootstrap";
import { create } from "@/rollo";

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
  const element = create(`div.toast`, {
    parent: toast_container,
    role: "alert",
  });
  element.attribute.ariaLive = "assertive";
  element.attribute.ariaAtomic = "true";

  const header = create(
    `div.toast-header.d-flex.align-items-center`,
    {},
    typeof title === "string" ? create("h1.fs-6", {}, title) : title
  );
  header.classList.add(`text-bg-${style}`);

  console.log(header)

  const body = create(`div.toast-body`, {}, content);
  // Handle dismiss button
  if (dismissible) {
    const dismiss_button = create(`button.btn-close.ms-auto`, {
      type: "button",
    });
    dismiss_button.attribute.dataBsDismiss = "toast"
    dismiss_button.attribute.ariaLabel = "Close"
    if (["danger", "primary", "secondary", "success"].includes(style)) {
      dismiss_button.classList.add(`btn-close-white`);
    }
    header.append(dismiss_button);
  }

  element.append(header, body);

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
