import "./bootstrap.scss";
import "./main.css";
import { create } from "./rollo";
import { toast } from "rolloui/toast";
import { modal } from "rolloui/modal";

create(null, {id: 'root', parent: document.body})


toast("Staying long", "Content", { delay: 20000, style: 'success' });

const result = await modal(
  { title: "Hello world!", content: "The modal function is awesome.", size: 'lg', style: 'primary' },
  ["OK", true, 'success'], ["Cancel", false, 'danger']
);
console.log("Modal result:", result);

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
