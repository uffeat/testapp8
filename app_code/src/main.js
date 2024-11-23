import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

create('', { id: "root", parent: document.body });


await (async () => {
  const { create } = await import("rollo/component");
  const { TextInput } = await import("rolloui/form/input/TextInput");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    TextInput({name: "my_name", required: true }),
    
    //CheckInput({ label: "Agree", name: "agree", required: false, value: true })
  );
  
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
