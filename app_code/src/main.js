import "./bootstrap.scss";
import "./main.css";


await (async () => {
  await import("rollo/components/data/data_state");
  const { create } = await import("rollo/component");
  const { State } = await import("rollo/factories/state");

  create("div", {
    id: "root",
    parent: document.body,
  });

  const state = create('data-state', {name: 'my-state', parent: root})

  state.effects.add((changes, previous) => {
    console.log('previous:', previous)
    console.log('changes:', changes)
    console.log('current:', state.items.current)
  })

  // use items.update etc

  state.$.foo = 42
  state.$.foo = 43
  state.$.bar = 'bar'
  state.$.stuff = 'stuff'

  //state.items.reset(undefined)

  //const filtered = state.items.current.filter(([k, v]) => typeof v === 'string') 
  //console.log('filtered:', filtered)

  
  state.items.filter(([k, v]) => {
    if (k === 'stuff') {
      return false
    } else {
      return true
    }
  })
    
 

  /*
  TODO
  - test data/state methods etc.
  - data-effect componnent
  
  */

  /* GOAL:
  Allow seeting state items directly from conditional effect, e.g.,
  state.$.foo = something..., so that a conditional effect is set up that updates foo
  ... or something similar 
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
