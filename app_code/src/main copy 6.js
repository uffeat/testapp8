import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { create } = await import("rollo/component");
  const { State } = await import("rollo/factories/state");

  create("div", {
    id: "root",
    parent: document.body,
  });

  function use_state(component) {
    const state = State.create();
    const effect = (current) => {
      component.update(current);
    };
    // This could be it - try later: state.effects.add(effect);
    return state;
  }

  function Component() {
    const component = create("h1", {text: 'Unclicked'});
    const state = use_state(component);
    state.$.text = "Clicked";

    // TODO Idea: Use component's items or update?

    component.on.click = (event) => {
      component.text = state.$.text;
    };

    return component;
  }

  root.append(Component())


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
