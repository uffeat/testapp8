import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";












create("button.btn.btn-primary", { parent: root }, "Yo World!");

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
