import "./bootstrap.scss";
import "./main.css";

await (async () => {
  await import("rollo/components/data/data_state");
  await import("rollo/components/data/data_effect");
  const { create } = await import("rollo/component");

  create("div", {
    id: "root",
    parent: document.body,
  });

  const my_state = create("data-state", { name: "my_state", parent: root });

  my_state.$.foo = 42;
  my_state.$.bar = "bar";
  my_state.$.stuff = "stuff";





  
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
