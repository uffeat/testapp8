import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO form
// ... then dropdown and popover
// ... then ProgressiveImage
// ... then nav bar

create("DIV", { id: "root", parent: document.body });

await (async () => {
  const { close, modal } = await import("rolloui/modal");
  const result = await modal(
    {
      title: "Hello world!",
      content: "The modal function is awesome.",
      size: "lg",
      style: "primary",
    },
    {text: "OK", value: true, css: "btn-success"},
    {text: "Cancel", value: false, css: "btn-danger"}
  );
  console.log("Modal result:", result);
})();

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
