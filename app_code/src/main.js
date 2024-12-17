import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { create } = await import("rollo/component");
  const { State } = await import("rollo/factories/state");

  create("div", {
    id: "root",
    parent: document.body,
  });

  function use_state(component, updates = {}) {
    const state = State.create();
    const effect = (current) => {
      component.update(current);
    };
    state.effects.add(effect);
    state.update(updates);
    return state;
  }

  /*
  TODO
  - some enable outside code to set state, perhaps by
    - simply add a state prop to component - or let it be a manuel option
    - wrap a state web component around the component
    - something else; think factory?

    use_state could be a standard component method (use_state factory)? 
    Thereby avoiding the need to pass in component... perhaps activate/deactive according to connected?
  */

  function Component() {
    const component = create("h1");
    const state = use_state(component, { text: "Unclicked" });

    //state.$.text = "Unclicked";

    component.on.click = (event) => {
      state.$.text = "Clicked";
    };

    component.state = state;

    return component;
  }

  const component = Component();

  root.append(component);

  component.state.$.text = "changed";
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
