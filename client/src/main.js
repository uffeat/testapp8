await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");
const { Modal } = await use("@/rollolibs/bootstrap/bootstrap.js");
const { Client, anvil } = await use("@/rolloanvil/");


//const client_1 = Client({slot: 'data', parent: app})
//const client_3 = Client({parent: app, src: 'bar'})

await (async () => {
  //const response = await client_1.$.echo({ number: 42 })
  //console.log("client response:", response)
})();

await (async () => {
  //const response = await client_1.call('echo', { number: 42 }, {timeout: 2000})
  //console.log("client response:", response)
})();

await (async () => {
  const response = await anvil.client.echo({ number: 42 })
  console.log("client response:", response)
})();


await (async () => {
  const response = await anvil.server.echo({ number: 42 }, {timeout: 2000})
  console.log("server response:", response)
})();





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
