await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

const { Modal } = await use("@/rollolibs/bootstrap/");

const element = component.div(
  "modal",
  { tab: -1 },
  component.div(
    "modal-dialog",
    {},
    component.div(
      "modal-content",
      {},
      component.div("modal-header", {},
        component.button('btn-close', {type:"button", '[dataBsDismiss]': "modal", '[ariaLabel]': "Close"}),
      ),
      component.div("modal-body", {}),
      component.div("modal-footer", {})
    )
  )
);

const modal = new Modal(element)

modal.show()
