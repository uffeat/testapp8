
await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");
const { Modal } = await use("@/rollolibs/bootstrap/bootstrap.js");
const { anvil } = await use("@/rolloanvil/anvil.js");



/*
const iframe = component.iframe('plot', {
  src: 'https://testapp8dev.anvil.app/bar',
})
app.append(iframe)
*/





app.anvil.client
  .echo({ number: 42 })
  .then((response) => console.log("client response:", response));


app.anvil.server
  .echo({ number: 42 })
  .then((response) => console.log("server response:", response));


  /*
  
(() => {
  const element = component.div(
  "modal.anvil",
  {
    tab: -1,
  },
  component.div(
    "modal-dialog.modal-lg",
    {},
    component.div(
      "modal-content",
      {},
      component.div(
        "modal-header",
        {},
        component.button("btn-close", { type: "button" })
      ),
      component.div('modal-body')
    )
  )
);

const modal = new Modal(element, {});

const container = element.find(".modal-body");

const iframe = component.iframe('plot', {
  src: 'https://testapp8dev.anvil.app/bar',
})

container.append(iframe)
modal.show();

})();
  */