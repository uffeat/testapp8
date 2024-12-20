import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");

  await import("rollo/type/types/data/data");


  
  const data = type.create("data", {
    foo: "FOO",
  });

  console.log('data:', data)
  console.log('chain:', data.__chain__)
  console.log('class:', data.__class__)
  console.log('type:', data.__type__)
  
 







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
