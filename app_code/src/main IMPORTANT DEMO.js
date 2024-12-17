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

  const state = create("data-state", { name: "my-state", parent: root }, [
    () => console.log("From hook effect"),
  ]);

  /* Effect to watch data */
  state.effects.add((changes, previous, owner) => {
    //console.log("previous:", previous);
    //console.log("changes:", changes);
    console.log("current:", state.items.current);
    //state.$.foo = 48;
  });

  /* Updating effect to handle new number items */
  state.effects.add(
    ([changes, previous, owner]) => {
      const updates = changes.map(([k, v]) => [k, 2 * v]);
      owner.items.update(updates);
    },
    (changes, previous, owner) => {
      return [
        changes.filter(
          ([k, v]) => typeof v === "number" && previous[k] === undefined
        ),
        previous,
        owner,
      ];
    }
  );

  state.$.foo = 42;

  state.$.bar = "bar";
  state.$.stuff = "stuff";

  //state.items.reset(undefined)
  //state.items.reset(true)
  //state.items.filter(([k, v]) => k !== "stuff");
  //state.items.transform(([k, v]) => typeof v === "number" ? [k, 2 * v] : [k, v]);
  //state.items.update({pind: 'pind', ting: 'ting', foo: undefined})
  //state.items.update([['pind', undefined], ['bar', 'BAR']])

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
