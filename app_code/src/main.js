import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { Conditional } = await import("rollo/type/types/conditional/conditional");

  const conditional = Conditional.create({source: (...args) => console.log(`Got args:`, args)})

  conditional(42)


  
  
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
