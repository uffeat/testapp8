import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { Conditional } = await import(
    "rollo/type/types/conditional/conditional"
  );

  const conditional = Conditional.create({
    source: (arg) => console.log(`Got arg:`, arg),
    condition: (arg) => typeof arg === 'number',
    transformer: (arg) => 2*arg,
  });

  conditional(42);
  conditional('foo');

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
