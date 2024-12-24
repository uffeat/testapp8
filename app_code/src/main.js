import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: undefined,
  });

  const classes = data.__classes__;

  ////console.log("classes:", classes);////

  console.log("classes.classes:", classes.classes);
  console.log("classes.defined:", classes.defined);
  console.log("classes.names:", classes.names);
  console.log("classes.prototypes:", classes.prototypes);

  console.log("size:", classes.size);


  classes.prototypes.clean.clean.call(data);
  console.log("After clean:", data.data);

  
})();

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`@/tests/${path}.js`);
    }
  });
}
