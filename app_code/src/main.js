import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");
  //await import("rollo/type/types/state/state");
  await import("rollo/type/types/data/data");

  const data = type.create("data", [['stuff', 'STUFF']]);
  const data_1 = type.config("data", {'foo': 42})({bar: 'bar'})
  const data_2 = data.clone()

  console.log('data:', data)
  //console.log('data_2:', data_2)
  console.log('data.__chain__:', data.__chain__)
  console.log('data.__class__:', data.__class__)

  //console.log('data_1:', data_1)

  console.dir(data)
 

 

  


/*
  const state = type.create("state", {
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  //console.log('current:', state.current)

  state.effects.add({source: (effect) => {
    //console.log('effect:', effect)
    //console.log('current:', effect.current)
  }})
    */



})();



/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
