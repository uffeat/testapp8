import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test 'update' */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  /* Set up effect to check batch-updates. */
  data.effects.add((change) => {
    console.log("change:", change.current); ////

    const session = change.session || 0;
    if (session > 1) {
      console.error(
        `Effect ran ${session + 1} times; batch-update does not work correctly!`
      );
    }
  });

  /* Change data */
  data.update({ foo: "FOO", bar: "BAR", stuff: undefined });
  /* Check final result */
  const expected = {
    foo: "FOO",
    bar: "BAR",
  };
  if (data.match(expected)) {
    console.log(`Success! Current data:`, data.data);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.data);
  }

  console.log("data.data:", data.data);
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