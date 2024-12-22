// state_effect

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/state/state");
  await import("rollo/type/types/state/subscription");

  const state = type.create("state", {
    name: "my_state",
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  state.effects.add((data) => {
    //console.log("data:", data);
    console.log("previous from effect:", data.previous);
    console.log("current from effect:", data.current);
  });

  state.foo = "foo";

  console.log("current:", state.current);
  console.log("previous:", state.previous);
})();