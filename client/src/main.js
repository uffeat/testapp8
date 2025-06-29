await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");
const { Modal } = await use("@/rollolibs/bootstrap/bootstrap.js");
//const { anvil } = await use("@/rolloanvil/anvil.js");
const { Client } = await use("@/rolloanvil/client.js");

const client = Client({slot: 'data', parent: app})
const client_2 = Client({parent: app, src: 'bar'})

await (async () => {
  const response = await client.call('echo', { number: 42 }, {timeout: 2000})
  console.log("client response:", response)
})();




//const bar = AnvilClient({parent: app, src: 'bar'})


/*
const iframe = component.iframe('plot', {
  src: 'https://testapp8dev.anvil.app/bar',
})
app.append(iframe)
*/

await (async () => {
  //const response = await app.anvil.client.echo({ number: 42 })
  //console.log("client response:", response)
})();


/*
app.anvil.client
  .echo({ number: 42 })
  .then((response) => {
    console.log("client response:", response)
  });
  */


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
