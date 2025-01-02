import "./bootstrap.scss";
import "./main.css";

//import "@/tests/_data_all"

/* Purpose: Demonstate and test Data.computed. */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  data.computed
    .add("sum", () => {



      return data.reduce(
        (data) => data.values.filter((v) => typeof v === "number"),
        (numbers) => {
          let sum = 0;
          numbers.forEach((v) => (sum += v));
          return sum;
        }
      )







      let sum = 0;
      data.values
        .filter((v) => typeof v === "number")
        .forEach((v) => (sum += v));
      return sum;
    })
    .effects.add((change) => {
      console.log("sum:", data.sum);
    });

  data.$.foo = 8;

 
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
