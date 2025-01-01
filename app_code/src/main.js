import "./bootstrap.scss";
import "./main.css";

//import "@/tests/_data_all"

/* Purpose: Demonstate and test Data.computed. */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: 42,
    bar: 8,
    stuff: "stuff",
  });

  const effects = data.computed.add(
    /* Reducer */
    (current) => {
      let sum = 0;
      for (const v of Object.values(current)) {
        sum += v;
      }
      return sum;
    },
    "foo",
    "bar"
  );

  let result;

  effects.add(({ current }) => {
    console.log("current:", current);
    result = current;
  });

  (() => {
    const expected = 50;
    const message = `Expected ${expected}. Actual: ${result}`;
    if (result === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();

  data.$.foo = 60;
  data.$stuff = "STUFF";

  (() => {
    const expected = 68;
    const message = `Expected ${expected}. Actual: ${result}`;
    if (result === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();
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
