import "./bootstrap.scss";
import "./main.css";

import { create } from "component/component";
import { html } from "utils/html";
import { Modal } from "bootstrap";

function modal({dismissible=true, title=''} = {}) {
  const element = create(
    "div.modal",
    { parent: document.body, attr_tabindex: "-1" },
    html` 
    <style global>
      .modal-header button.btn-close {
        display: var(--visible, initial);
      }
    </style>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">${title}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">...</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn ${true ? "btn-success" : ""}">
            Understood
          </button>
        </div>
      </div>
    </div>`
  );

  element.css_var.visible = 'none'

  // Create Bootstrap Modal
  const modal = new Modal(element, {dismissible: false});

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

const result = modal({})

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
