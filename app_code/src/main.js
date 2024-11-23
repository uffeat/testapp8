import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";


create(null, { id: "root", parent: document.body });

await (async () => {
  const { close, modal } = await import("rolloui/modal");
  const result = await modal(
    {
      title: "Hello world!",
      centered: true,
      content: "The modal function is awesome.",
      size: "lg",
      style: "primary",
    },
    ["OK", true, "success"],
    ["Cancel", false, "danger"]
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
