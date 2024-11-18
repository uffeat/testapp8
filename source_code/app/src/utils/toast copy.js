import { Toast } from "bootstrap";
import { create } from "component/component";; ////


// Create toast container to control stacked toasts
document.body.classList.add("position-relative");
const toast_container = create(
  `div.position-fixed.bottom-0.end-0.p-3.d-flex.flex-column.row-gap-3.z-3`,
  { id: "toastContainer", parent: document.body }
);

/* Shows a toast */
export function toast(
  title,
  content,
  {
    animation = true,
    autohide = true,
    delay = 5000,
    dismissible = true,
    style = "primary",
  } = {}
) {
  
  // Prepare styling
  const header_class = `.text-bg-${style}`;
  let dismiss_class = "";
  if (["danger", "primary", "secondary", "success"].includes(style)) {
    dismiss_class = `.btn-close-white`;
  }

  // Prepare title
  if (title) {
    if (typeof title === "string") {
      title = create(`h1.fs-6.text.p-0.m-0`, {}, title);
    }
  }

  // Prepare content
  if (content) {
    if (typeof content === "string") {
      content = create(`p.m-0`, {}, content);
    }
  }

  // Handle dismiss button
  if (dismissible) {
    dismissible = create(`button.btn-close.ms-auto${dismiss_class}`, {
      type: "button",
      data_bsDismiss: "toast",
      attr_ariaLabel: "Close"
    })
      
     
  } else {
    dismissible = "";
  }

  // Create toast element
  const element = create(
    `div.toast`,
    { parent: toast_container, role: "alert", attr_ariaLive: "assertive", attr_ariaAtomic: "true" },
    create(
      `div.toast-header.d-flex.align-items-center${header_class}`,
      {},
      title,
      dismissible
    ),
    create(`div.toast-body`, {}, content)
  )

  // Create Bootstrap Toast
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
# EXAMPLES

## Example: Hello World

import {toast} from "utils/toast";

toast({
  title: "Hello world!",
  content: "The toast function is awesome.",
  delay: 10000,
  style: 'success'
});

*/
