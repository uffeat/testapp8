import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/state/state");
  await import("rollo/type/types/state/subscription");

  const state = type.create("state", {
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  //console.log("current:", state.current);

  state.effects.add((data) => {
    //console.log("data:", data);
    //console.log("current:", data.current);
    //console.log("previous:", data.previous);
  });

  state.update({ foo: "foofoo" });



  const family = type.create("state", {
    uffe: 1969,
    charlotte: 1969,
    hugo: 2003,
    carl: 2005,
  });

  family.$.uffe = type.create("subscription", {
    state: state,
    condition: "foo",
    reducer: (data) => data.current.foo,
  });

  family.effects.add((data) => {
    //console.log("data:", data);
    console.log("uffe:", data.current.uffe);
    //console.log("previous:", data.previous);
  }, 'uffe');


  state.$.foo = 'FooBar'







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
