import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { create } = await import("rollo/component");
  const { State } = await import("rollo/factories/state");

  create("div", {
    id: "root",
    parent: document.body,
  });

  const state = State.create();

  function Component() {
    const component = create("h1");
    component.text = this.$.text || "";
    console.log(component);
  }

  const effect = function (current, previous, owner) {
    console.log("current:", current);

    const component = create("h1");
    component.text = owner.$.text || "";
    console.log(component);
  };
  state.effects.add(effect);

  state.$.text = "My text";

  function use_state(component) {
    const state = State.create();

    const effect = (current) => {
      component.update(current);
    };

    state.effects.add(effect);

    return state;
  }

  
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
