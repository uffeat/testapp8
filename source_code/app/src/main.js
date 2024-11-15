import "./bootstrap.scss";
import "./main.css";
import { create } from "@/utils/component";



create("button.btn.btn-primary", { parent: root }, "Hello world");



if (import.meta.env.DEV) {
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      const path = prompt("Path:");
      await import(`./tests/${path}.js`);
    }
  });
}
