import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test Data.filter */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

 
  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    
  });

 

  /* Change data */
  data.filter(([k, v]) => typeof v === "number");
  

  /* Check final result */
  const expected = { stuff: 42 };
  if (data.match(expected)) {
    console.log(`Success! Current data:`, data.current);
  } else {
    console.error(`Expected:`, expected, `Got:`, data.current);
  }
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
