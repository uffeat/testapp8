import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
  });

  const [current, previous] = data.update({foo: 'FOO', bar: 'BAR'})
  console.log("current:", current);
  console.log("previous:", previous);


  console.log("data:", data);

  
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
